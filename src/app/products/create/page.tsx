import { Suspense } from 'react';
import CreateProductForm from './form';
import Loading from '@/components/loading';

export default function CreateProductPageWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateProductForm /> 
    </Suspense>
  );
}