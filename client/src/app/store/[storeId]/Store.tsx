'use client';
import { Heading } from "@/components/ui/Heading";
import { MainStatistics } from "./statistics/main-statistics/MainStatistics";
import { MiddleStatistics } from "./statistics/middle-statistics/MiddleStatistics";

export default function Store() {
  return (
    <div className='p-6'>
      <Heading title='Statistics' />
      <MainStatistics />
      <MiddleStatistics />
    </div>
  );
}
