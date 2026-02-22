"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import "react-image-crop/dist/ReactCrop.css"

interface AvatarCropperProps {
  imageSrc: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onCropComplete: (croppedImage: File) => void
  aspect?: number
  minWidth?: number
  minHeight?: number
}

export function AvatarCropper({
  imageSrc,
  open,
  onOpenChange,
  onCropComplete,
  aspect = 1, // Square by default
  minWidth = 200,
  minHeight = 200,
}: AvatarCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    )
    setCrop(crop)
  }, [aspect])

  const onCropChange = (crop: Crop) => {
    setCrop(crop)
  }

  const onCropCompleteHandler = useCallback((crop: PixelCrop) => {
    setCompletedCrop(crop)
  }, [])

  const getCroppedImg = useCallback(async (): Promise<Blob> => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      throw new Error("Crop data not available")
    }

    const image = imgRef.current
    const canvas = previewCanvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("No 2d context")
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const pixelRatio = window.devicePixelRatio || 1

    canvas.width = Math.floor(completedCrop.width * pixelRatio * scaleX)
    canvas.height = Math.floor(completedCrop.height * pixelRatio * scaleY)

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = "high"

    const cropX = completedCrop.x * scaleX
    const cropY = completedCrop.y * scaleY

    const rotateRads = rotate * (Math.PI / 180)
    const centerX = image.naturalWidth / 2
    const centerY = image.naturalHeight / 2

    ctx.save()

    // 5) Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY)
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY)
    // 3) Rotate around the origin
    ctx.rotate(rotateRads)
    // 2) Scale the image
    ctx.scale(scale, scale)
    // 1) Move the center of the image to the origin (0,0)
    ctx.translate(-centerX, -centerY)

    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    )

    ctx.restore()

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"))
          return
        }
        resolve(blob)
      }, "image/jpeg", 0.9)
    })
  }, [completedCrop, rotate, scale])

  const handleSave = async () => {
    try {
      const croppedBlob = await getCroppedImg()
      const fileName = `avatar-${Date.now()}.jpg`
      const croppedFile = new File([croppedBlob], fileName, {
        type: "image/jpeg",
        lastModified: Date.now(),
      })
      
      onCropComplete(croppedFile)
      onOpenChange(false)
      
      // Reset crop state
      setCrop(undefined)
      setCompletedCrop(undefined)
      setScale(1)
      setRotate(0)
    } catch (error) {
      console.error("Error cropping image:", error)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    // Reset crop state
    setCrop(undefined)
    setCompletedCrop(undefined)
    setScale(1)
    setRotate(0)
  }

  const handleScaleChange = (value: number[]) => {
    setScale(value[0])
  }

  const handleRotateChange = (value: number[]) => {
    setRotate(value[0])
  }

  useEffect(() => {
    if (completedCrop && previewCanvasRef.current && imgRef.current) {
      const canvas = previewCanvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const pixelRatio = window.devicePixelRatio || 1
      canvas.width = Math.floor(completedCrop.width * pixelRatio)
      canvas.height = Math.floor(completedCrop.height * pixelRatio)

      ctx.scale(pixelRatio, pixelRatio)
      ctx.imageSmoothingQuality = "high"

      const cropX = completedCrop.x
      const cropY = completedCrop.y
      const cropWidth = completedCrop.width
      const cropHeight = completedCrop.height

      ctx.drawImage(
        imgRef.current,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      )
    }
  }, [completedCrop])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Crop Avatar</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Crop Area */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg border bg-muted">
              <ReactCrop
                crop={crop}
                onChange={onCropChange}
                onComplete={onCropCompleteHandler}
                aspect={aspect}
                minWidth={minWidth}
                minHeight={minHeight}
                className="max-w-full"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imageSrc}
                  style={{
                    transform: `scale(${scale}) rotate(${rotate}deg)`,
                    maxWidth: "100%",
                    maxHeight: "400px",
                  }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="scale" className="text-sm font-medium">
                  Scale: {scale.toFixed(1)}x
                </Label>
                <Slider
                  id="scale"
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={[scale]}
                  onValueChange={handleScaleChange}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="rotate" className="text-sm font-medium">
                  Rotate: {rotate}°
                </Label>
                <Slider
                  id="rotate"
                  min={-180}
                  max={180}
                  step={1}
                  value={[rotate]}
                  onValueChange={handleRotateChange}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Preview</h3>
              <div className="relative overflow-hidden rounded-full border bg-muted flex items-center justify-center"
                   style={{ width: "200px", height: "200px" }}>
                {completedCrop ? (
                  <canvas
                    ref={previewCanvasRef}
                    className="rounded-full"
                    style={{
                      width: "200px",
                      height: "200px",
                      border: "1px solid black",
                    }}
                  />
                ) : (
                  <div className="text-muted-foreground text-sm">Crop preview will appear here</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!completedCrop}>
            Save Avatar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}