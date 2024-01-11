'use client';

import { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react';

type ConfirmationAlertProps = {
  title: string;
  description?: string;
  colorScheme?: string;
  actionText: string;
  loadingText?: string;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const ConfirmationAlert = ({
  title,
  description,
  colorScheme,
  actionText,
  loadingText,
  isOpen,
  isLoading,
  onConfirm,
  onClose,
}: ConfirmationAlertProps) => {
  const alertCancelRef = useRef(null);

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={alertCancelRef}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent margin={4}>
        <AlertDialogHeader>{title}</AlertDialogHeader>
        <AlertDialogBody>{description}</AlertDialogBody>
        <AlertDialogFooter>
          <Button
            ref={alertCancelRef}
            colorScheme="brand"
            variant="outline"
            marginRight={2}
            isDisabled={isLoading}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            colorScheme={colorScheme || 'brand'}
            loadingText={loadingText}
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {actionText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationAlert;
