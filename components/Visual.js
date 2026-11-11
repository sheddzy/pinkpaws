import Image from 'next/image';
import { IMAGES } from '@/lib/content';

// Shows the photo configured in lib/content.js IMAGES, or a branded panel until one is added.
export default function Visual({ id, alt, label, tall }) {
  const src = IMAGES[id];
  return (
    <div className={'vis' + (tall ? ' tall' : '')}>
      {src ? <Image src={src} alt={alt} fill sizes="(max-width:860px) 100vw, 560px" /> : <div className="ph" role="img" aria-label={alt}>{label}</div>}
    </div>
  );
}
