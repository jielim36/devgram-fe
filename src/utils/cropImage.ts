import { Area } from "react-easy-crop"

export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
        image.src = url
    })

export function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation)

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    }
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export default async function getCroppedImg(
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
): Promise<Blob | null> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    const rotRad = getRadianAngle(rotation)

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    )

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth
    canvas.height = bBoxHeight

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(rotRad)
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.width / 2, -image.height / 2)

    // draw rotated image
    ctx.drawImage(image, 0, 0)

    const croppedCanvas = document.createElement('canvas')

    const croppedCtx = croppedCanvas.getContext('2d')

    if (!croppedCtx) {
        return null
    }

    // Set the size of the cropped canvas
    if (pixelCrop.width === 0 && pixelCrop.height === 0) {
        const defaultCropSize = Math.min(image.width, image.height)
        pixelCrop.width = defaultCropSize
        pixelCrop.height = defaultCropSize
    }

    croppedCanvas.width = pixelCrop.width
    croppedCanvas.height = pixelCrop.height

    // Draw the cropped image onto the new canvas
    croppedCtx.drawImage(
        canvas,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    )

    // As Base64 string
    // return croppedCanvas.toDataURL('image/jpeg');

    // As a blob
    // return new Promise((resolve, reject) => {
    //     croppedCanvas.toBlob((file) => {
    //         resolve(URL.createObjectURL(file as Blob))
    //     }, 'image/jpeg')
    // })
    return new Promise((resolve, reject) => {
        croppedCanvas.toBlob((blob) => {
            if (blob) {
                resolve(blob)
            } else {
                reject(new Error('Canvas is empty'))
            }
        }, 'image/jpeg')
    })
}

export const generatePreviewImage = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
): Promise<string | null> => {

    const blob: Blob | null = await getCroppedImg(imageSrc, pixelCrop, rotation, flip);

    if (blob) {
        return URL.createObjectURL(blob as Blob);
    }

    return null;
}

export const generateDownload = async (croppedImage: string, crop: Area, rotation: number = 0) => {
    if (!croppedImage || !crop) return;

    const blob: Blob | null = await getCroppedImg(croppedImage, crop, rotation);

    // console.log('previewUrl', previewUrl);
    // Download the image
    if (blob) {
        const anchor = document.createElement('a');
        anchor.download = 'image.jpeg';
        anchor.href = URL.createObjectURL(blob);
        anchor.click();
    }

}