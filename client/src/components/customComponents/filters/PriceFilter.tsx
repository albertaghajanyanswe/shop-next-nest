import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Input } from '@/components/ui/formElements/Input';
import { Button } from '@/components/ui/Button';
import { useDebounce } from '@/hooks/commons/useDebounce';

interface PriceFilterProps {
  onChange: ({ min, max }: { min: number; max: number }) => void;
}

export function PriceFilter({ onChange }: PriceFilterProps) {
  // --- Applied values ---
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(1000000);

  // --- Local input values (not applied yet) ---
  const [minInput, setMinInput] = useState(0);
  const [maxInput, setMaxInput] = useState(1000000);

  // debounce only applied values
  const debMin = useDebounce(minValue, 1000);
  const debMax = useDebounce(maxValue, 1000);

  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    if (isFirst) {
      setIsFirst(false);
      return;
    }

    onChange({ min: debMin, max: debMax });
  }, [debMin, debMax, isFirst]);

  // --- Slider (applies immediately) ---
  const onSliderChange = (values: number[]) => {
    setMinValue(values[0]);
    setMaxValue(values[1]);
    setMinInput(values[0]);
    setMaxInput(values[1]);
  };

  // --- Inputs (do not apply immediately) ---
  const onMinChange = (val: string) => {
    const num = Number(val.replace(/\D/g, '')) || 0;
    setMinInput(num);
  };

  const onMaxChange = (val: string) => {
    const num = Number(val.replace(/\D/g, '')) || 0;
    setMaxInput(num);
  };

  // --- Apply button ---
  const apply = () => {
    setMinValue(minInput);
    setMaxValue(maxInput);
  };

  return (
    <div className='space-y-6'>
      <Slider
        value={[minValue, maxValue]}
        min={0}
        max={1000000}
        step={10}
        onValueChange={onSliderChange}
      />

      <div className='mt-1 flex flex-col items-center gap-2 text-xs'>
        <Input
          value={minInput}
          onChange={(e) => onMinChange(e.target.value)}
          className='w-full text-xs'
          name='price_lte'
          aria-label='price_lte'
        />

        <span className='text-muted-foreground'>Min - Max</span>

        <Input
          value={maxInput}
          onChange={(e) => onMaxChange(e.target.value)}
          className='w-full text-xs'
          name='price_gte'
          aria-label='price_gte'
        />

        <Button className='mt-2 w-full text-xs' size='sm' onClick={apply}>
          Apply
        </Button>
      </div>
    </div>
  );
}

// import { useState, useEffect } from 'react';
// import { Slider } from '@/components/ui/Slider';
// import { Input } from '@/components/ui/formElements/Input';
// import { useDebounce } from '@/hooks/commons/useDebounce';

// interface PriceFilterProps {
//   onChange: ({ min, max }: { min: number; max: number }) => void;
// }

// export function PriceFilter({ onChange }: PriceFilterProps) {
//   const [minValue, setMinValue] = useState(1);
//   const [maxValue, setMaxValue] = useState(1000000);

//   const debMin = useDebounce(minValue, 1500);
//   const debMax = useDebounce(maxValue, 1500);

//   useEffect(() => {
//     onChange({ min: debMin, max: debMax });
//   }, [debMin, debMax]);

//   // --- Inputs ---
//   const onMinChange = (val: string) => {
//     const numeric = val.replace(/\D/g, '');
//     const num = Number(numeric) || 0;
//     setMinValue(num);
//   };

//   const onMaxChange = (val: string) => {
//     const numeric = val.replace(/\D/g, '');
//     const num = Number(numeric) || 0;
//     setMaxValue(num);
//   };

//   // --- Slider ---
//   const onSliderChange = (values: number[]) => {
//     setMinValue(values[0]);
//     setMaxValue(values[1]);
//   };

//   return (
//     <div className='space-y-6'>
//       <Slider
//         value={[minValue, maxValue]}
//         min={0}
//         max={1000000}
//         step={10}
//         onValueChange={onSliderChange}
//       />

//       <div className='flex flex-col items-center gap-2 text-xs mt-1'>
//         <Input
//           value={minValue}
//           onChange={(e) => onMinChange(e.target.value)}
//           className='w-full text-xs'
//         />

//         <span className='text-muted-foreground'>Min - Max</span>

//         <Input
//           value={maxValue}
//           onChange={(e) => onMaxChange(e.target.value)}
//           className='w-full text-xs'
//         />
//       </div>
//     </div>
//   );
// }
