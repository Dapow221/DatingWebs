import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  VStack,
  IconButton,
  Text,
  Textarea,
} from '@chakra-ui/react';
import type { CreateFormSchema } from '../validation/form';
import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { api } from '~/utils/api';
import { useDropzone } from "react-dropzone";
import { X, ImagePlus } from 'lucide-react';
import uploadToS3 from "~/server/s3"
import DatePicker from "~/components/Features/Post/components/DatePicker"

interface FileWithPreview extends File {
  preview: string;
}

type PostFormProps = {
  createdById: string,
  onSuccess?: () => Promise<void>
}

const uploadImages = async (files: FileWithPreview[]): Promise<string[]> => {
  const urls = await Promise.all(files.map(async (file) => {
    const url = await uploadToS3(file);
    return url;
  }));
  return urls;
};

export const OpenModal: React.FC<PostFormProps> = ({ createdById, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [datePosted, setDatePosted] = useState<Date | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 4,
    onDrop: (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > 4) {
        toast({
          title: "Too many files",
          description: "You can only upload up to 4 images",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      const filesWithPreview = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFiles(prev => [...prev, ...filesWithPreview]);
    },
    onDropRejected: () => {
      toast({
        title: "Invalid file type",
        description: "Please upload only image files",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm<CreateFormSchema>({
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onChange"
  });

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClose = () => {
    reset();
    setFiles([]);
    setDatePosted(null);
    setUploadProgress(0);
    onClose();
  };

  const { mutate } = api.post.create.useMutation({
    onSuccess: async () => {
      setLoading(false);
      handleClose();
      toast({
        title: "Post created.",
        description: "Your post has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      if (onSuccess) {
        await onSuccess();
      }
    },
    onError: (error) => {
      setLoading(false);
      toast({
        title: "Error creating post.",
        description: "Something went wrong while creating your post.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error(error);
    }
  });;

  const submitPost: SubmitHandler<CreateFormSchema> = async (values) => {
    if (!datePosted) {
      toast({
        title: "Date required",
        description: "Please select a date for your post",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 90) {
          clearInterval(interval);
        }
        setUploadProgress(Math.min(progress, 90));
      }, 500);

      const imageUrls = await uploadImages(files);
      clearInterval(interval);
      setUploadProgress(100);

      mutate({
        title: values.title,
        description: values.description,
        createdById,
        images: imageUrls,
        datePosted: datePosted.toLocaleDateString()
      });
    } catch (error) {
      setLoading(false);
      setUploadProgress(0);
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <>
      <div className="flex justify-end mb-2">
        <Button onClick={onOpen}>Create Post</Button>

        <Modal isOpen={isOpen} onClose={handleClose} size="xl">
          <ModalOverlay />
          <ModalContent className="mx-4">
            <ModalHeader>Create New Post</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit(submitPost)}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.title}>
                    <FormLabel>Title</FormLabel>
                    <Controller
                      name="title"
                      control={control}
                      rules={{ required: "Title is required" }}
                      render={({ field }) => (
                        <Input 
                          {...field}
                          placeholder="Enter post title"
                        />
                      )}
                    />
                    {errors.title && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.title.message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!errors.description}>
                    <FormLabel>Description</FormLabel>
                    <Controller
                      name="description"
                      control={control}
                      rules={{ required: "Description is required" }}
                      render={({ field }) => (
                        <Textarea 
                          {...field}
                          placeholder="Enter post description"
                          rows={4}
                        />
                      )}
                    />
                    {errors.description && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.description.message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel>Images ({files.length}/4)</FormLabel>
                    <div
                      {...getRootProps()}
                      className={`flex flex-col items-center p-5 border-2 border-dashed rounded-lg 
                        ${files.length >= 4 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500'} 
                        transition-all duration-200`}
                    >
                      <input {...getInputProps()} disabled={files.length >= 4} />
                      <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                      <Text fontSize="sm" textAlign="center">
                        {files.length >= 4 
                          ? "Maximum images reached" 
                          : "Drop images here or click to select"}
                      </Text>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Supports: JPG, PNG, GIF (Max 4 images)
                      </Text>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {files.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={file.preview}
                            alt={`Preview ${index}`}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <IconButton
                            aria-label="Remove image"
                            icon={<X />}
                            size="sm"
                            colorScheme="red"
                            position="absolute"
                            top={2}
                            right={2}
                            onClick={() => removeFile(index)}
                            opacity={0}
                            className="group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      ))}
                    </div>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Date</FormLabel>
                    <DatePicker onSelect={setDatePosted} />
                  </FormControl>

                  {loading && uploadProgress > 0 && (
                    <div className="w-full">
                      <Text fontSize="sm" mb={2}>Uploading: {Math.round(uploadProgress)}%</Text>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </VStack>

                <ModalFooter className="px-0 mt-6">
                  <Button variant="ghost" mr={3} onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    variant='ghost'
                    isLoading={loading}
                    loadingText="Creating..."
                    isDisabled={!isValid || loading || !datePosted}
                  >
                    Create Post
                  </Button>
                </ModalFooter>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};