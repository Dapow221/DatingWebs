import Image from 'next/image';
import Header from '~/assets/header.jpg';

const Sticker = () => {
  return (
      <Image
        src={Header}
        style={{
          objectFit: 'cover',
        }}
        alt="Ghibli"
      />
  );
};

export default Sticker;
