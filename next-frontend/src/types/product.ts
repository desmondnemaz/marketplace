export interface Product {
    id?: number;
    name: string;
    description: string;
    brand: string;
    priceUsd: number;
    priceZig: number;
    category: string;
    supplier: string;
    available: boolean;
    quantity: number;
    releaseDate: string;
    imageName?: string;
    imageType?: string;
}