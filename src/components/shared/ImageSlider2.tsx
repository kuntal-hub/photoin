'use client';
import Image from 'next/image';
import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { ChevronsLeft, ChevronsRight, Heart } from 'lucide-react';
import { useEffect,useState } from 'react';
import { toggleWishProduct,isAddedToWishlist } from '@/lib/actions/wishlist.action';
import { useToast } from '../ui/use-toast';
import { ToastAction } from '../ui/toast';
import { useRouter } from 'next/navigation';
import { addWishlist, removeWishlist } from '@/lib/features/wishlistSlice';
import { useAppDispatch } from '@/lib/hooks';


const ImageSlider2 = ({ images,badge,userId,productId,duration=5000,product }: { images: string[],badge?:string | undefined,userId?:string | null,productId:string,duration?:number,product?:ProductView }) => {

    const { toast } = useToast();
    const router = useRouter();
    const isArrow = images.length > 1;
    const [isWish, setIsWish] = useState<boolean | null>(false);
    const dispatch = useAppDispatch();

    const toggleWish = async () => {
        if (!userId) {
            toast({
                title: "Login Required",
                description: "You need to login to add product to wishlist",
                variant: "destructive",
                action: <ToastAction altText="Login"
                onClick={() => router.push('/sign-in')}
                >
                    Login
                </ToastAction>,
              })
        } else {
            setIsWish((prev) => !prev);
            const res = await toggleWishProduct(productId,userId);
            if (res === true && product) {
                if (isWish) {
                    dispatch(removeWishlist(productId));
                } else {
                    dispatch(addWishlist(product));
                }
            }
        }
    }

    useEffect(() => {
        const checkWish = async () => {
            if (userId) {
                const result = await isAddedToWishlist(productId,userId);
                setIsWish(result);
            }
        }
        checkWish();
    }, []);

    return (
        <div className='w-full max-w-[450px] relative'>
            <Slide duration={duration} indicators={true} arrows={true}
                nextArrow={<button className={`hover:bg-white bg-white/40 p-1 ${!isArrow && "hidden"}`}>
                    <ChevronsRight className='md:w-6' />
                </button>}
                prevArrow={<button className={`hover:bg-white bg-white/40 p-1 ${!isArrow && "hidden"}`}>
                    <ChevronsLeft className='md:w-6' />
                </button>}
                pauseOnHover={true}
                transitionDuration={500}
                autoplay={isArrow}
            >
                {
                    images.map((image, index) => (
                        <div className="each-slide-effect" key={image}>
                            <Image src={image} alt="banner" width={450} height={600} 
                            className='aspect-[3/4] w-full rounded-xl object-cover bg-gray-200' />
                        </div>
                    ))
                }
            </Slide>
            {badge && <div className="ribbon"><span>{badge}</span></div>}
            {userId && <button onClick={toggleWish}
            className={`absolute top-1 left-1 ${isWish ? "bg-white" : "bg-white/50"} hover:bg-white rounded-full w-9 h-9 p-2 `}>
                {
                    isWish ? <img src="/icons/heart-svgrepo-com.svg" alt="liked" /> : <Heart size={20} /> 
                }
            </button>}
        </div>
    );
};

export default ImageSlider2;
