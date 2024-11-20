// ====== USER PARAMS
declare type CreateUserParams = {
    clerkId: string;
    email: string;
    firstName: string;
    lastName: string;
    photo: string;
  };
  
  declare type UpdateUserParams = {
    firstName: string;
    lastName: string;
    photo: string;
  };

    declare type User = {
        _id: string;
        clerkId: string;
        email: string;
        firstName: string;
        lastName: string;
        photo: string;
        createdAt: string;
        updatedAt: string;
    };

    declare type UserDetils = {
        _id: string;
        clerkId: string;
        email: string;
        firstName: string;
        lastName: string;
        photo: string;
        createdAt: string;
        updatedAt: string;
        orders: {
            _id: string;
            total: number;
            status: "pending" | "processing" | "completed" | "cancelled";
            deliveryStatus: "ordered" | "shipped" | "outOfDelivery" | "delivered";
            createdAt: string;
        }[];
        wishlists: {
            _id: string;
            name: string;
            mainPhoto: string;
            maxPrice: number;
            discountedPrice?: number;
        }[];
        cartItems: {
            _id: string;
            product: {
                _id: string;
                name: string;
                description?: string;
                maxPrice: number;
                discountedPrice?: number;
                mainPhoto: string;
                badge?: string;
            };
            quantity: number;
            processedImage?: string;
            formData?: {
                data: any;
                images: any;
            };
        }[];
        reviews: {
            _id: string;
            rating: number;
            comment: string;
            product: string;
            image?: string;
            createdAt: string;
        }[];
        addresses: {
            _id: string;
            name: string;
            phone: string;
            pinCode: string;
            locality: string;
            address: string;
            district: string;
            state: string;
            landmark?: string;
        }[];
        tempCarts: {
            _id: string;
            product: {
                _id: string;
                name: string;
                mainPhoto: string;
                maxPrice: number;
                discountedPrice?: number;
            };
            images: any;
            createdAt:string,
            updatedAt:string
        }[];
        tempReviews: {
            _id: string;
            product: string;
            reviewImage: any;
        }[];
    };

// ====== CATAGORY_FORM PARAMS

declare type Catagory = {
    _id: string;
    name: string;
    description?: string;
    logo?: string;
    banner?: string;
    rank? :number;
};

declare type createCategoryParams = {
    name: string;
    description?: string;
    logo?: string;
    banner?: string;
    rank? :number;
};

declare type updateCategoryParams = {
  name?: string;
  description?: string;
  logo?: string;
  banner?: string;
  rank? :number;
}

declare type CatagoryFormParams = {
  action: "create" | "update";
  data?: Catagory | null;
};

declare type categoriesView = {
    _id: string;
    name: string;
    description?: string;
    logo?: string;
    banner?: string;
    rank? :number;
    products: ProductView[];
};
  

// ====== PRODUCT_FORM PARAMS

declare type Product = {
    _id: string;
    name: string;
    description?: string;
    photos: string[];
    mainPhoto: string;
    badge?: string;
    discountedPrice?: number;
    isAddedToWishlist?: boolean;
    maxPrice: number;
    catagory: string;
    features?: string[];
    designId?: string;
    maxDeliveryDays?: number;
    minDeliveryDays?: number;
    forms: ProductInputForm[];
    rank?: number;
};

declare type ProductViewForCustomization = {
    _id: string;
    name: string;
    description?: string;
    photos: string[];
    mainPhoto: string;
    badge?: string;
    discountedPrice?: number;
    isAddedToWishlist?: boolean;
    maxPrice: number;
    catagory: string;
    features?: string[];
    designId?: string;
    quantity: number;
    maxDeliveryDays?: number;
    minDeliveryDays?: number;
    forms: ProductInputForm[];
    rank?: number;
    cart?:{
        _id: string;
        quantity: number;
        processedImage?: string;
        formData?: {
            data: any;
            images: any;
        };
    }
};

declare type ProductDetails = {
    _id: string;
    name: string;
    description?: string;
    photos: string[];
    mainPhoto: string;
    badge?: string;
    discountedPrice?: number;
    maxPrice: number;
    features?: string[];
    maxDeliveryDays?: number;
    minDeliveryDays?: number;
    rating:number | null;
    reviewCount:number;
    similarProducts:ProductView[];
    "star1":number;
    "star2":number;
    "star3":number;
    "star4":number;
    "star5":number;
};

declare type ProductInputForm ={
  label: string;
  type: "text" | "number" | "email" | "date" | "time" | "select" | "radio" | "checkbox" | "url" | "image" | "images" | "textarea";
  isRequired: boolean;
  placeholder?: string;
  selectValues?: string[];
  radioOptions?: string[];
  maxLength?: number;
  minLength?: number;
}

declare type createProductParams = {
    name: string;
    description?: string;
    badge?: string;
    discountedPrice?: number;
    maxPrice: number;
    catagory: string;
    designId?: string;
    maxDeliveryDays?: number;
    minDeliveryDays?: number;
    rank?: number;
};

declare type Form = {
    label: string;
    type: "text" | "number" | "email" | "date" | "time" | "select" | "radio" | "checkbox" | "url" | "image" | "images" | "textarea";
    isRequired: boolean;
    placeholder?: string;
    selectValues?: string[];
    radioOptions?: string[];
    maxLength?: number;
    minLength?: number;
};

declare type ProductView = {
    _id: string;
    name: string;
    mainPhoto: string;
    badge?: string;
    discountedPrice?: number;
    maxPrice: number;
    rank?: number;
};

// ====== SEARCH PARAMS

declare type SearchSuggestions = {
    query: string;
    _id: string;
};

// ====== REVIEW PARAMS

declare type Review = {
    _id: string;
    rating: number;
    comment: string;
    product:string;
    fakeName?: string;
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        photo: string;
        clerkId: string;
    };
    image?: string;
    createdAt: string;
};

declare type createReviewParams = {
    rating: number;
    comment: string;
    image?: string;
    clerkId: string;
    fakeName?: string;
    product: string;
};

declare type ProductReviews = {
    productId: string;
    reviews: Review[];
    page: number;
    hasmore: boolean;
    isReviewedByMe: boolean;
}




// ====== CART PARAMS

declare type AddToCartParams = {
    productId: string;
    formData?: {
        data: any;
        images: any;
    };
    processedImage? :string;
    quantity:number;
}

declare type CartItem = {
    _id: string;
    product: {
        _id: string;
        name:string;
        description?:string;
        maxPrice:number;
        discountedPrice?:number;
        mainPhoto:string;
        minDeliveryDays:number;
        maxDeliveryDays:number;
        badge?:string;
    };
    quantity: number;
    formData?: {
        data: any;
        images: any;
    };
    processedImage?: string;
};

declare type UnplacedCartItems = {
    _id: string;
    product: {
        _id: string;
        name:string;
        maxPrice:number;
        discountedPrice?:number;
        mainPhoto:string;
    };
    buyer: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    quantity: number;
    processedImage?: string;
    formData?: {
        data: any;
        images: any;
    };
    createdAt: string;
    updatedAt: string;
}

declare type TempItems = {
    _id: string;
    product: {
        _id: string;
        name:string;
        maxPrice:number;
        discountedPrice?:number;
        mainPhoto:string;
    };
    buyer: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        clerkId: string;
    };
    images: any;
    createdAt: string;
    updatedAt: string;
}

// ======= TEMP PARAMS

declare type AddTempParams = {
    productId: string;
    type?: 'product' | 'review';
    fieldName: string;
    value: any;
}

declare type TempImage = {
    productId: string;
    images: any;
    isFatched: boolean;
}

declare type TempReview = {
    _id: string;
    buyer: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        clerkId: string;
        photo: string;
    };
    image: string;
}


// ====== ADDRESS SCHEMA

declare type AddressActionParams = {
    name: string;
    phone: string;
    pinCode: string;
    locality: string;
    address: string;
    district: string;
    state: string;
    landmark?: string;
};

declare type Address = {
    _id: string;
    user?: string;
    name: string;
    phone: string;
    pinCode: string;
    locality: string;
    address: string;
    district: string;
    state: string;
    landmark?: string;
}

// ====== ORDER SCHEMA

declare type PlaceOrderParams ={
    products: {
        product: string;
        quantity: number;
        formData?: {
            data: any;
            images: any;
        };
        processedImage?: string;
    }[];
    total: number;
    paymentMethod: "cod" | "online";
    deliveryAddress: string;
    type: "cart"| "single";
}

declare type Order = {
    
} 

declare type AdminOrder = {
    _id: string;
    buyer: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    totalProducts: number;
    totalProductsQuantity: number;
    total: number;
    status: "pending" | "processing" | "completed" | "cancelled";
    paymentMethod: "cod" | "online";
    paymentStatus: "pending" | "completed" | "failed";
    deliveryStatus: "ordered" | "shipped" | "outOfDelivery" | "delivered";
    createdAt: Date;
    updatedAt: Date;
}

declare type GetAllOrederParams = {
    days: number;
    status: "pending" | "processing" | "completed" | "cancelled" | "all";
    paymentMethod: "cod" | "online" | "all";
    paymentStatus: "pending" | "completed" | "failed" | "all";
    deliveryStatus: "ordered" | "shipped" | "outOfDelivery" | "delivered" | "all";
    page: number;
    limit: number;
}

declare type ViewedAdminOrder = {
    _id: string;
    buyer: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    products: {
        product: {
            _id: string;
            description?: string;
            name: string;
            mainPhoto: string;
            photos:string[];
            maxPrice: number;
            discountedPrice?: number;
        };
        quantity: number;
        formData?: {
            data: any;
            images: any;
        };
        processedImage?: string;
    }[];
    deliveryAddress: {
        _id: string;
        name: string;
        phone: string;
        pinCode: string;
        locality: string;
        address: string;
        district: string;
        state: string;
        landmark?:string;
    }
    total: number;
    status: "pending" | "processing" | "completed" | "cancelled";
    paymentMethod: "cod" | "online";
    paymentStatus: "pending" | "completed" | "failed";
    deliveryStatus: "ordered" | "shipped" | "outOfDelivery" | "delivered";
    createdAt: Date;
    updatedAt: Date;
}

declare type MyOrders = {
    _id: string;
    product: {
        _id: string;
        description?: string;
        name: string;
        mainPhoto?: string;
        photos:string[];
    };
    review?:{
        _id:string,
        rating:number,
        comment:string
    },
    status: "pending" | "processing" | "completed" | "cancelled";
    deliveryStatus: "ordered" | "shipped" | "outOfDelivery" | "delivered";
    createdAt: Date;
    updatedAt: Date;
}

declare type MyOrderDetails = {
    _id: string;
    products: {
        _id: string;
        description?: string;
        name: string;
        mainPhoto: string;
        photos:string[];
        maxPrice: number;
        discountedPrice?: number;
        quantity: number;
        review?:{
            _id:string;
            rating:number;
            comment:string;
            image?:string;
            product:string;
        },
    }[];
    deliveryAddress: {
        _id: string;
        name: string;
        phone: string;
        pinCode: string;
        locality: string;
        address: string;
        district: string;
        state: string;
        landmark?:string;
    }
    total: number;
    status: "pending" | "processing" | "completed" | "cancelled";
    paymentMethod: "cod" | "online";
    paymentStatus: "pending" | "completed" | "failed";
    deliveryStatus: "ordered" | "shipped" | "outOfDelivery" | "delivered";
    createdAt: Date;
    updatedAt: Date;
}