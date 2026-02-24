"use client";

import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function BenefitsBanner() {
    return (
        <section className="relative w-full overflow-hidden border-y-4 border-[#a66d03]">
            <AnimatedSection>
                <div className="relative w-full aspect-[21/8] sm:aspect-[21/6] md:aspect-[21/5] lg:aspect-[21/4] xl:aspect-[1920/300] min-h-[120px] md:min-h-[180px]">
                    {/* Background Banner */}
                    <Image
                        src="/benefits-bg.png"
                        alt="Beneficios de nuestras salidas grupales"
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />

                    {/* Badge Overlay - Centered */}
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="relative w-full max-w-[90%] md:max-w-[70%] lg:max-w-[800px] aspect-[4/1] flex items-center justify-center">
                            <Image
                                src="/benefits-badge.png"
                                alt="Habitación doble a compartir garantizada"
                                width={800}
                                height={200}
                                className="object-contain drop-shadow-xl"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </AnimatedSection>
        </section>
    );
}
