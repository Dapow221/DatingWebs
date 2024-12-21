import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
  VStack,
  IconButton,
  Textarea,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useDropzone } from "react-dropzone";
import { X, ImagePlus } from 'lucide-react';
import uploadToS3 from "~/server/s3";
import DatePicker from "~/components/Features/Post/components/DatePicker";
import { api } from '~/utils/api';

interface FileWithPreview extends File {
  preview: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  onPostUpdated?: () => Promise<void>;
}

interface EditFormData {
  title: string;
  description: string;
  datePosted: string;
}

export const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, postId, onPostUpdated }) => {
  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm<EditFormData>({
    mode: "onChange"
  });
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [existingImages, setExistingImages] = useState<{ url: string }[]>([]);
  const [datePosted, setDatePosted] = useState<Date | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { data: post } = api.post.getPostById.useQuery(postId, {
    enabled: isOpen, 
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 4,
    onDrop: (acceptedFiles: File[]) => {
      const totalImages = files.length + existingImages.length + acceptedFiles.length;
      if (totalImages > 4) {
        toast({
          title: "Too many files",
          description: "You can only have up to 4 images total",
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

  const { mutate: updatePost } = api.post.updatePost.useMutation({
    onSuccess: async () => {
      setLoading(false);
      if (onPostUpdated) {
        await onPostUpdated();
      }
      handleClose();
      toast({
        title: "Post updated.",
        description: "Your post has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error) => {
      setLoading(false);
      toast({
        title: "Error updating post.",
        description: "Something went wrong!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error(error);
    },
  });

  const handleClose = () => {
    reset();
    setFiles([]);
    setUploadProgress(0);
    onClose();
  };

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        description: post.description,
        datePosted: post.datePosted || '',
      });
      setExistingImages(post.images);
      if (post.datePosted) {
        setDatePosted(new Date(post.datePosted));
      }
    }
  }, [post, reset]);

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  const uploadImages = async (files: FileWithPreview[]): Promise<string[]> => {
    return Promise.all(files.map(file => uploadToS3(file)));
  };

  const onSubmit = async (values: EditFormData) => {
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

      const newImageUrls = files.length > 0 ? await uploadImages(files) : [];
      clearInterval(interval);
      setUploadProgress(100);
      
      const allImageUrls = [
        ...existingImages.map(img => img.url),
        ...newImageUrls
      ];

      updatePost({
        id: postId,
        title: values.title,
        description: values.description,
        datePosted: datePosted.toLocaleDateString(),
        images: allImageUrls
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

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent className="mx-4">
        <ModalHeader>Edit Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                <FormLabel>Images ({existingImages.length + files.length}/4)</FormLabel>

                <div
                  {...getRootProps()}
                  className={`flex flex-col items-center p-5 border-2 border-dashed rounded-lg mb-3
                  ${existingImages.length + files.length >= 4 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500'} 
                  transition-all duration-200`}
                >
                  <input {...getInputProps()} disabled={existingImages.length + files.length >= 4} />
                  <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                  <Text fontSize="sm" textAlign="center">
                    {existingImages.length + files.length >= 4 
                      ? "Maximum images reached" 
                      : "Drop images here or click to select"}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Supports: JPG, PNG, GIF (Max 4 images)
                  </Text>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={image.url}
                        alt={`Existing ${index}`}
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
                        onClick={() => removeExistingImage(index)}
                        opacity={0}
                        className="group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  {files.map((file, index) => (
                    <div key={`new-${index}`} className="relative group">
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
                        onClick={() => removeNewImage(index)}
                        opacity={0}
                        className="group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </FormControl>

              <FormControl>
                <FormLabel>Date Posted</FormLabel>
                <DatePicker onSelect={setDatePosted} initialDate={datePosted} />
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
                variant="ghost"
                isLoading={loading}
                loadingText="Updating..."
                isDisabled={!isValid || loading || !datePosted}
              >
                Save Changes
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};