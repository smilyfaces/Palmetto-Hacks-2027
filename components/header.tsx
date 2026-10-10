import Image from "next/image";

export default function Header() {
    return (
        <div className="absolute left-0 right-0 top-0 z-40 flex h-20 bg-white/0 justify-between">
            <Image
                src="/logo.png"
                alt="Logo"
                width={1254}
                height={1254}
                className="h-auto w-18 aspect-square object-contain"
            />
            <Image
                src="/tier.png"
                alt="Tier"
                width={447}
                height={447}
                className="h-auto w-18 aspect-square object-contain"
            />
        </div>
    );
}