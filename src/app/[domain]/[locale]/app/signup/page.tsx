import { Metadata } from 'next';
import { SignupForm } from './form';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Signup',
};

export default function Signup() {
  return <SignupForm />;
}
