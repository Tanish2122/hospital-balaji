import Link from "next/link";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`}>
      <div className="relative w-12 h-12 flex items-center justify-center">
        <Image 
          src="/images/logo.png" 
          alt="Balaji Hospital Logo" 
          width={48} 
          height={48} 
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-display font-bold text-slate-900 leading-none">Balaji Cure & Care</span>
        <span className="text-[10px] text-medical-600 font-bold uppercase tracking-wider mt-0.5">Multispeciality Hospital</span>
      </div>
    </Link>
  );
}
