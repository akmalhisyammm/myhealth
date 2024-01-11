import { Button, Image } from '@chakra-ui/react';

type ICPButtonProps = {
  isLoading: boolean;
  onClick: () => void;
};

const ICPButton = ({ isLoading, onClick }: ICPButtonProps) => {
  return (
    <Button
      size={['md', 'lg', 'lg']}
      loadingText="Masuk dengan Internet Identity"
      width={['full', 'auto', 'auto']}
      marginY={4}
      leftIcon={<Image src="/icons/icp-logo.png" alt="ICP Logo" width={[18, 30, 30]} />}
      isLoading={isLoading}
      onClick={onClick}
    >
      Masuk dengan Internet Identity
    </Button>
  );
};

export default ICPButton;
