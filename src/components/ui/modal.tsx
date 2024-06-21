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
  } from '@chakra-ui/react'
  import type { CreateFormSchema } from '../validation/form'
  import React from 'react'
  import { useForm, Controller, SubmitHandler } from 'react-hook-form'
  import { api } from '~/utils/api'
  
  type PostFormProps = {
    createdById: string,
  }
  
  export const OpenModal: React.FC<PostFormProps> = ({ createdById }) => {
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
  
    const submitPost: SubmitHandler<CreateFormSchema> = (values) => {
      mutate({
        title: values.title,
        description: values.description,
        createdById
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
  