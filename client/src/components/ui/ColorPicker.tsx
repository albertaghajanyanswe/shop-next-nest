'use client';

import { useEffect, useState, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import * as ColorUtils from '@/lib/colorUtils';
import { Button } from '@/components/ui/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { Input } from '@/components/ui/form-elements/Input';
import { Label } from '@/components/ui/form-elements/Label';
import { Slider } from '@/components/ui/Slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

interface ColorPickerProps {
  color?: string;
  onChange?: (value: string) => void;
  triggerClassName?: string;
}

type ColorMode = 'hex' | 'rgba' | 'hsla';
type CopyState = { [key in ColorMode]: boolean };

export function AdvancedColorPicker({
  color = '#000000',
  onChange,
  triggerClassName = 'w-[240px] justify-start text-left font-normal',
}: ColorPickerProps) {
  const [currentColor, setCurrentColor] = useState(color);
  const [colorMode, setColorMode] = useState<ColorMode>('hex');
  const [copied, setCopied] = useState<CopyState>({
    hex: false,
    rgba: false,
    hsla: false,
  });
  const colorPlaneRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const rgb = ColorUtils.hexToRgb(currentColor) || { r: 0, g: 0, b: 0 };
  const hsl = ColorUtils.rgbToHsl(rgb);
  const rgbaString = ColorUtils.formatRgba(rgb);
  const hslaString = ColorUtils.formatHsla(hsl);

  useEffect(() => {
    setCurrentColor(color);
  }, [color]);

  const handleColorChange = (newColor: string) => {
    setCurrentColor(newColor);
    onChange?.(newColor);
  };

  const updateHSL = (h: number, s: number, l: number) => {
    const rgb = ColorUtils.hslToRgb({ h, s, l });
    handleColorChange(ColorUtils.rgbToHex(rgb));
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    handleColorPlaneChange(e);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging.current) {
      handleColorPlaneChange(e);
    }
  };

  const handleColorPlaneChange = (e: React.MouseEvent | React.TouchEvent) => {
    if (!colorPlaneRef.current) return;

    const rect = colorPlaneRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    updateHSL(hsl.h, Math.round(x * 100), Math.round((1 - y) * 100));
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  const copyToClipboard = (text: string, format: ColorMode) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({
      ...prev,
      [format]: true,
    }));
    setTimeout(() => {
      setCopied((prev) => ({
        ...prev,
        [format]: false,
      }));
    }, 1500);
  };

  const handleHexChange = (hex: string) => {
    console.log('hex', hex);
    // if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    handleColorChange(hex);
    // }
  };

  const handleRgbChange = (key: keyof typeof rgb, value: string) => {
    const numValue = Number.parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 255) {
      const newRgb = { ...rgb, [key]: numValue };
      handleColorChange(ColorUtils.rgbToHex(newRgb));
    }
  };

  const handleHslChange = (key: keyof typeof hsl, value: string) => {
    const numValue = Number.parseInt(value);
    if (isNaN(numValue)) return;

    const max = key === 'h' ? 360 : 100;
    if (numValue >= 0 && numValue <= max) {
      const newHsl = { ...hsl, [key]: numValue };
      const newRgb = ColorUtils.hslToRgb(newHsl);
      handleColorChange(ColorUtils.rgbToHex(newRgb));
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={`justify-start text-left font-normal ${triggerClassName}`}
        >
          <div className='flex w-full items-center gap-2'>
            <div
              className='h-4 w-4 rounded border !bg-cover !bg-center transition-all'
              style={{ backgroundColor: currentColor }}
            />
            <div className='flex-1 truncate'>{currentColor}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='grid gap-4'>
          <div
            ref={colorPlaneRef}
            className='relative h-48 w-full cursor-crosshair touch-none rounded-lg'
            style={{
              // backgroundColor: `hsl(${hsl.h}, 100%, 50%)`,
              background: `
                linear-gradient(
                  180deg,
                  #fff 0%,
                  rgba(128, 128, 128, 0) 50%,
                  #000 100%
                ),
                radial-gradient(
                  ellipse at 100% 50%,
                  /* Hue at 0%, fade to transparent by 100% */
                  hsl(${hsl.h}, 100%, 50%) 0%,
                  transparent 100%
                )
              `,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            <div
              className='pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md'
              style={{
                left: `${hsl.s}%`,
                top: `${100 - hsl.l}%`,
                backgroundColor: currentColor,
              }}
            />
          </div>

          <div className='grid gap-2'>
            <Label>Hue</Label>
            <div className='relative'>
              <Slider
                value={[hsl.h]}
                max={360}
                step={1}
                className='[&_.bg-primary]:bg-transparent [&_.bg-secondary]:bg-transparent [&_[role=slider]]:h-4 [&_[role=slider]]:w-4'
                onValueChange={([h]) => updateHSL(h, hsl.s, hsl.l)}
                style={{
                  backgroundImage: `linear-gradient(to right,
                    hsl(0, 100%, 50%),
                    hsl(60, 100%, 50%),
                    hsl(120, 100%, 50%),
                    hsl(180, 100%, 50%),
                    hsl(240, 100%, 50%),
                    hsl(300, 100%, 50%),
                    hsl(360, 100%, 50%)
                  )`,
                }}
              />
              <style jsx global>{`
                .slider-thumb {
                  background-color: hsl(${hsl.h}, 100%, 50%) !important;
                  border: 2px solid white !important;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
                }
              `}</style>
            </div>
          </div>

          <Tabs
            value={colorMode}
            onValueChange={(v) => setColorMode(v as ColorMode)}
          >
            <TabsList className='w-full'>
              <TabsTrigger value='hex' className='flex-1'>
                Hex
              </TabsTrigger>
              <TabsTrigger value='rgba' className='flex-1'>
                RGBA
              </TabsTrigger>
              <TabsTrigger value='hsla' className='flex-1'>
                HSLA
              </TabsTrigger>
            </TabsList>

            <TabsContent value='hex' className='mt-2'>
              <div className='flex gap-2'>
                <Input
                  value={currentColor}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className='font-mono'
                />
                <Button
                  variant='ghost'
                  size='icon'
                  className='shrink-0'
                  onClick={() => copyToClipboard(currentColor, 'hex')}
                >
                  {copied.hex ? (
                    <Check className='h-4 w-4' />
                  ) : (
                    <Copy className='h-4 w-4' />
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value='rgba' className='mt-2'>
              <div className='grid gap-4'>
                <div className='flex gap-2'>
                  <Input value={rgbaString} readOnly className='font-mono' />
                  <Button
                    variant='ghost'
                    size='icon'
                    className='shrink-0'
                    onClick={() => copyToClipboard(rgbaString, 'rgba')}
                  >
                    {copied.rgba ? (
                      <Check className='h-4 w-4' />
                    ) : (
                      <Copy className='h-4 w-4' />
                    )}
                  </Button>
                </div>
                <div className='grid grid-cols-4 gap-2'>
                  <div>
                    <Label className='ml-1'>R</Label>
                    <Input
                      value={rgb.r}
                      onChange={(e) => handleRgbChange('r', e.target.value)}
                      className='font-mono'
                    />
                  </div>
                  <div>
                    <Label className='ml-1'>G</Label>
                    <Input
                      value={rgb.g}
                      onChange={(e) => handleRgbChange('g', e.target.value)}
                      className='font-mono'
                    />
                  </div>
                  <div>
                    <Label className='ml-1'>B</Label>
                    <Input
                      value={rgb.b}
                      onChange={(e) => handleRgbChange('b', e.target.value)}
                      className='font-mono'
                    />
                  </div>
                  <div>
                    <Label className='ml-1'>A</Label>
                    <Input value='1' readOnly className='font-mono' />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='hsla' className='mt-2'>
              <div className='grid gap-4'>
                <div className='flex gap-2'>
                  <Input value={hslaString} readOnly className='font-mono' />
                  <Button
                    variant='ghost'
                    size='icon'
                    className='shrink-0'
                    onClick={() => copyToClipboard(hslaString, 'hsla')}
                  >
                    {copied.hsla ? (
                      <Check className='h-4 w-4' />
                    ) : (
                      <Copy className='h-4 w-4' />
                    )}
                  </Button>
                </div>
                <div className='grid grid-cols-4 gap-2'>
                  <div>
                    <Label className='ml-1'>H</Label>
                    <Input
                      value={hsl.h}
                      onChange={(e) => handleHslChange('h', e.target.value)}
                      className='font-mono'
                    />
                  </div>
                  <div>
                    <Label className='ml-1'>S</Label>
                    <Input
                      value={hsl.s}
                      onChange={(e) => handleHslChange('s', e.target.value)}
                      className='font-mono'
                    />
                  </div>
                  <div>
                    <Label className='ml-1'>L</Label>
                    <Input
                      value={hsl.l}
                      onChange={(e) => handleHslChange('l', e.target.value)}
                      className='font-mono'
                    />
                  </div>
                  <div>
                    <Label className='ml-1'>A</Label>
                    <Input value='1' readOnly className='font-mono' />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div
            className='h-6 rounded border'
            style={{ backgroundColor: currentColor }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
