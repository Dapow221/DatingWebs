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
  Button
} from '@chakra-ui/react';
import type { CreateFormSchema } from '../validation/form';
import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { api } from '~/utils/api';
import { useDropzone } from "react-dropzone";
import uploadToS3 from "~/server/s3"

interface FileWithPreview extends File {
  preview: string;
}

type PostFormProps = {
  createdById: string,
}

const uploadImages = async (files: FileWithPreview[]): Promise<string[]> => {
  const urls = await Promise.all(files.map(async (file) => {
    const url = await uploadToS3(file);
    return url;
  }));
  return urls;
};

export const OpenModal: React.FC<PostFormProps> = ({ createdById }) => {

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const { getRootProps:getRootfileProps, getInputProps:getInputfileProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles: File[]) => {
      const filesWithPreview = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFiles(filesWithPreview);
    },
  });

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const { control, handleSubmit, reset } = useForm<CreateFormSchema>({
    defaultValues: {
      title: "",
      description: "",
    }
  });

  const { mutate } = api.post.create.useMutation({
    onSuccess: () => {
      reset();
      onClose();
    },

    onError: (error) => {
      console.log("Error creating post:", error);
    }
  });

  const submitPost: SubmitHandler<CreateFormSchema> = async (values) => {
    const imageUrls = await uploadImages(files);
    mutate({
      title: values.title,
      description: values.description,
      createdById,
      images: imageUrls,
    });
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <div className='flex justify-end mb-2'>
        <Button onClick={onOpen}>Create Post</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Post</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit(submitPost)}>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Controller
                    name="title" 
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <FormLabel>Description</FormLabel>
                  <Controller
                    name="description" 
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <FormLabel>Image</FormLabel>
                  <div
                      {...getRootfileProps()}
                      className={`flex flex-col items-center p-5 border-2 border-dashed bg-gray-100 text-gray-500 outline-none transition-border duration-150 ease-in-out`}
                    >
                      <input {...getInputfileProps()} />
                      <span className="text-sm">Drop hero image here, or click to select file</span>
                    </div>

                    {files.map((file, index) => (
                      <div key={index} className="my-2">
                        <img
                          className="w-full h-auto max-w-xl"
                          src={file.preview}
                          alt={`Preview ${index}`}
                        />
                      </div>
                    ))}
                </FormControl>
                <ModalFooter>
                  <Button colorScheme='ghost' mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button type='submit' variant='ghost'>Add Post</Button>
                </ModalFooter>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </>
  )
}
