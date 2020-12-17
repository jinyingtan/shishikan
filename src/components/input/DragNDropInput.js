import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MAXIMUM_FILE_SIZE_LIMIT, MAXIMUM_ALLOWED_PHOTOS } from '@constants/file';
import { v4 as uuidv4 } from 'uuid';
import { DeleteIcon } from '@chakra-ui/icons';
import { Text, useToast, theme, useTheme, IconButton, Box } from '@chakra-ui/react';

const getColor = (props) => {
  const theme = useTheme();
  if (props.isDragAccept) {
    return theme.colors.green['300'];
  }
  if (props.isDragReject) {
    return theme.colors.red['300'];
  }
  if (props.isDragActive) {
    return theme.colors.blue['300'];
  }
  return theme.colors.gray['300'];
};

const DragNDropContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: ${theme.colors.white};
  color: ${theme.colors.gray['500']};
  outline: none;
  transition: border 0.24s ease-in-out;
`;

const HorizontalImagesContainer = styled.div`
  display: flex;
  overflow: auto;
  flex-wrap: nowrap;
`;

const DraggableImageContainer = styled.div``;

const NormalText = styled.p`
  margin: 8px auto;
`;

const Error = styled(NormalText)`
  font-size: 12px;
  color: ${theme.colors.red['500']};
  font-weight: 500;
  line-height: 16px;
  width: 100%;
  margin-top: 2px;
  top: 100%;
  max-height: 16px;
  font-family: 'Roboto', -apple-system, '.SFNSText-Regular', 'San Francisco', 'Segoe UI', 'Helvetica Neue',
    'Lucida Grande', sans-serif;
  margin-bottom: 40px;
`;

const ImageWrapper = styled.img`
  margin: 10px;
  min-height: 100px;
  min-width: 100px;
  height: 100px;
  width: 100px;
  object-fit: cover;
  object-position: center;
`;

const DeleteWrapper = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
  margin: 12px;
`;

const CoverTextWrapper = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  background-color: black;
  border-radius: 5px;

  width: 100px;
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  flex: 0 0 auto;
`;

const Image = ({ src, onDeleteClick }) => {
  return (
    <ImageContainer>
      <ImageWrapper src={src} />
      <DeleteWrapper>
        <IconButton
          aria-label="Search database"
          icon={<DeleteIcon />}
          borderRadius="100%"
          size="xs"
          onClick={onDeleteClick}
        />
      </DeleteWrapper>
    </ImageContainer>
  );
};

const DragNDropInputField = ({ onChange, error, initialImages = null }) => {
  const toast = useToast();
  const [selectedImages, setSelectedImages] = useState([]);
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop: (files) => onUpload(files, selectedImages),
    accept: '.jpeg, .png, .jpg',
  });

  const onUpload = useCallback((acceptedFiles, selectedImages) => {
    if (acceptedFiles.some((file) => file.size > MAXIMUM_FILE_SIZE_LIMIT)) {
      toast({
        title: 'Error',
        description: 'Unable to upload images that are more than 25mb',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      acceptedFiles = acceptedFiles.filter((file) => file.size <= MAXIMUM_FILE_SIZE_LIMIT);
    }

    const allowedRemainingImages = MAXIMUM_ALLOWED_PHOTOS - selectedImages.length;
    if (allowedRemainingImages < acceptedFiles.length) {
      toast({
        title: 'Error',
        description: 'Unable to upload more than 4 images',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    // Only take maximum 4 images.
    if (acceptedFiles.length > 0 && selectedImages.length <= MAXIMUM_ALLOWED_PHOTOS - 1) {
      const acceptedImages = acceptedFiles.map((file) => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
          id: uuidv4(),
        });
      });

      if (allowedRemainingImages > 0) {
        const allowedImages = acceptedImages.splice(0, allowedRemainingImages);
        setSelectedImages((prevSelectedImages) => [...prevSelectedImages, ...allowedImages]);
      }
    }
  }, []);

  useEffect(() => {
    onChange(selectedImages);
  }, [selectedImages]);

  useEffect(() => {
    if (initialImages) {
      let initial = initialImages.map((imageUrl) => ({
        preview: imageUrl,
        id: uuidv4(),
      }));
      setSelectedImages(initial);
    }
  }, [initialImages]);

  const onDragEnd = (result) => {
    if (!result.destination) {
      // dropped outside the list
      return;
    }
    const items = reorder(selectedImages, result.source.index, result.destination.index);
    setSelectedImages(items);
  };

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDeleteClick = (index) => {
    let cloneSelectedImages = [...selectedImages];
    cloneSelectedImages.splice(index, 1);
    setSelectedImages(cloneSelectedImages);
  };

  return (
    <Box
      w="100%"
      padding="10px"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="5px"
      _hover={{ cursor: 'pointer' }}
    >
      <DragNDropContainer {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop up to {MAXIMUM_ALLOWED_PHOTOS} photos, or click to select photos</p>
      </DragNDropContainer>
      {error && <Error>{error}</Error>}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <HorizontalImagesContainer ref={provided.innerRef} {...provided.droppableProps}>
              {selectedImages.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <DraggableImageContainer
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      isDragging={snapshot.isDragging}
                      draggableStyle={provided.draggableProps.style}
                    >
                      <Image src={item.preview} onDeleteClick={() => onDeleteClick(index)} />
                    </DraggableImageContainer>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </HorizontalImagesContainer>
          )}
        </Droppable>
      </DragDropContext>

      {selectedImages.length > 0 ? (
        <CoverTextWrapper>
          <Text align="center" color="white">
            Cover
          </Text>
        </CoverTextWrapper>
      ) : null}
    </Box>
  );
};

export default DragNDropInputField;
