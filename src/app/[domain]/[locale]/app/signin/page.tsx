import { Metadata } from 'next';
import { SigninForm } from './form';

export const metadata: Metadata = {
  title: 'Signin',
};

export default function Signin() {
  return <SigninForm />;
}
