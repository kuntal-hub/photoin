'use client';
import React from 'react'
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getAddressesByUserId, createAddress, updateAddress } from '@/lib/actions/address.action';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod';
import { useToast } from '../ui/use-toast';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import axios from 'axios'
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { CheckCheck } from 'lucide-react'

const schema = z.object({
  phone: z.string(),
  name: z.string(),
  pinCode: z.string(),
  locality: z.string(),
  address: z.string(),
  landmark: z.string().optional(),
  district: z.string(),
  state: z.string(),
});

type AddressSchema = z.infer<typeof schema>;

export default function AddressSection({ addressId, setAddressId, currentStep, setCurrentStep }: { addressId: string, setAddressId: React.Dispatch<React.SetStateAction<string>>, currentStep: 'address' | 'summary' | 'payment', setCurrentStep: React.Dispatch<React.SetStateAction<'address' | 'summary' | 'payment'>> }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultSelected, setDefaultSelected] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [addressCreateLoading, setAddressCreateLoading] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue, formState: { errors }, setError, setFocus, reset } = useForm<AddressSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: '',
      name: '',
      pinCode: '',
      locality: '',
      address: '',
      landmark: '',
      district: '',
      state: '',
    }
  });
  const pinCode = watch('pinCode');
  const addressToDeliver = addressId ? addresses.find(addr => addr._id === addressId) : null;

  useEffect(() => {
    (async () => {
      let regex = new RegExp(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/);

      if (regex.test(pinCode.replaceAll(' ', ''))) {
        setError('pinCode', { message:'finding' })
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pinCode.replaceAll(' ', '')}`)
        if (response.data[0].Status === 'Success') {
          // console.log(response.data[0])
          setValue('state', response.data[0].PostOffice[0].State)
          setValue('district', response.data[0].PostOffice[0].District)
          setError('pinCode', { message: '' })
        } else {
          setError('pinCode', { message: 'Invalid pin code' })
          setValue('state', '')
          setValue('district', '')
        }
      }
    })()
  }, [pinCode]);

  useEffect(() => {
    (async () => {
      const response: Address[] = await getAddressesByUserId();
      if (response) {
        setAddresses(response)
        if (response.length > 0) {
          setDefaultSelected(response[0]._id)
        } else {
          setShowCreateForm(true)
        }
        setAddressesLoading(false)
      } else {
        toast({
          title: 'Error',
          description: 'Error fetching addresses',
          variant: 'destructive'
        })
        setAddressesLoading(false)
      }
    })()
  }, [])

  const onSubmitHandler = async (data: AddressSchema) => {
    if (data.phone.length !== 10) {
      setError('phone', { message: 'Phone number must be 10 digits' })
      setFocus('phone')
      return;
    }
    if (data.pinCode.length !== 6 || errors.pinCode?.message) {
      setError('pinCode', { message: 'Please enter a valid pin code' })
      setFocus('pinCode')
      return;
    }
    setAddressCreateLoading(true)
    const response = await createAddress(data);
    if (response) {
      toast({
        title: 'Address saved',
        description: 'Your address has been saved successfully',
        className: 'bg-green-500 text-white'
      })
      setAddresses(priv => [...priv, response]);
      setAddressCreateLoading(false);
      setShowCreateForm(false);
      setAddressId(response._id);
      setDefaultSelected(response._id);
      reset();
      setCurrentStep('summary');
    } else {
      setAddressCreateLoading(false)
      toast({
        title: 'Error',
        description: 'Error saving address',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className='w-full'>
      <div className={`w-full h-12 rounded-t-md px-2 sm:px-4 flex flex-nowrap justify-between items-center ${currentStep === 'address' ? 'bg-blue-600 text-white' : "bg-white"}`}>
        <div className='flex flex-nowrap justify-start items-center'>
          <span 
          className={`h-5 w-5 flex justify-center items-center text-sm rounded-sm text-blue-600 ${currentStep==='address' ? "bg-white" : "bg-gray-100"}`}>1</span>
          <span className={`ml-4 font-bold block text-xs sm:text-sm ${currentStep === 'address' ? "text-white" : "text-gray-500"}`}>
            DELIVERY ADDRESS
          </span>
          {
            currentStep !== 'address' && <CheckCheck className='ml-2 h-5 w-5 text-blue-600' />
          }
        </div>
        {
          currentStep !== 'address' && <Button onClick={() => setCurrentStep('address')}
          variant='outline'
          className='text-blue-600 font-bold text-sm mt-4'
          >
            CHANGE
          </Button>
        }
      </div>
      {currentStep === 'address' ? <>
      {addressesLoading ? <div className='w-full bg-white shadow-md rounded-md h-96 sm:h-72 grid place-content-center'>
        <div className='loader2'></div></div> :
      <div className='w-full bg-white shadow-md rounded-md'>
        {
          addresses.map((address) => {
            return (
              <AddressCard
                key={address._id}
                address={address}
                defaultSelected={defaultSelected}
                setDefaultSelected={setDefaultSelected}
                setAddressId={setAddressId}
                setShowCreateForm={setShowCreateForm}
                setCurrentStep={setCurrentStep}
                setAddresses={setAddresses} />
            )
          })
        }
      </div>}

      {
        showCreateForm ?
          <>
            <div className='flex flex-nowrap justify-start items-center pl-4 sm:pl-8 py-4 mt-2 bg-blue-50'>
              <input type="radio" name="sample" checked readOnly className='w-4 h-4' />
              <span className='text-blue-600 ml-3'>
                ADD NEW ADDRESS
              </span>
            </div>
            <form className='w-full p-4 relative rounded-md sm:px-8 bg-blue-50 shadow-md' onSubmit={handleSubmit(onSubmitHandler)}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='name'>Full Name</Label>
                  <Input {...register('name', { required: true })} required type='text' id='name'
                    placeholder='Your full name'
                    className='w-full bg-gray-50' />
                </div>
                <div>
                  <Label htmlFor='phone'>Phone</Label>
                  <Input {...register('phone', { required: true })} required type='number' id='phone'
                    placeholder='Your 10-digit mobile number'
                    className='w-full bg-gray-50' />
                  {errors.phone && <p className='text-red-600 text-xs px-2'>{errors.phone.message}</p>}
                </div>
                <div>
                  <Label htmlFor='pinCode'>Pin Code</Label>
                  <Input {...register('pinCode', { required: true })} required type='number' id='pinCode'
                    placeholder='Your 6-digit pin code'
                    className='w-full bg-gray-50' />
                  {errors.pinCode && <div className='px-2'>{errors.pinCode.message === 'finding' ? <div className='flex mt-1 flex-nowrap items-center justify-start'><span className='spinner w-6 h-6'></span><span className='ml-2 text-gray-500 text-xs'>Finding...</span></div> :
                    <span className='text-red-600 text-xs'>{errors.pinCode.message}</span>}</div>}
                </div>
                <div>
                  <Label htmlFor='locality'>Locality <span className='text-gray-500'>{'(village/town/city)'}</span></Label>
                  <Input {...register('locality', { required: true })} required type='text' id='locality'
                    placeholder='Your area, street, colony, etc.'
                    className='w-full bg-gray-50' />
                </div>
                <div>
                  <Label htmlFor='address'>Full Address</Label>
                  <Textarea {...register('address', { required: true })} required id='address'
                    placeholder='House no., building name, street name, etc.'
                    className='w-full bg-gray-50' />
                </div>
                <div>
                  <Label htmlFor='landmark'>Landmark <span className='text-gray-500'>{'(Optional)'}</span></Label>
                  <Input {...register('landmark')} type='text' id='landmark'
                    placeholder='Nearby landmark'
                    className='w-full bg-gray-50' />
                </div>
                <div>
                  <Label htmlFor='district'>District</Label>
                  <Input {...register('district', { required: true })} required type='text' id='district'
                    placeholder='Your district'
                    className='w-full bg-gray-50' />
                </div>
                <div>
                  <Label htmlFor='state'>State</Label>
                  <Input {...register('state', { required: true })} required type='text' id='state'
                    placeholder='Your state'
                    className='w-full bg-gray-50' />
                </div>
              </div>
              <button type='submit'
                className='bg-orange-500 hover:bg-orange-600 text-white py-2 px-5 mt-5 h-12 font-bold rounded-sm'>
                SAVE AND DELIVER HERE
              </button>
              {addressCreateLoading && <div className=' absolute top-0 left-0 h-full w-full z-20 bg-black/40 grid place-content-center'>
                <div className='loader2'></div>
              </div>}
            </form>
          </> :
          <div className='mt-2'>
            <button onClick={() => {
              setShowCreateForm(true);
              setDefaultSelected('');
            }}
              className='w-full flex flex-nowrap justify-start items-center h-14 px-4 text-blue-600 rounded-md bg-white shadow-md'>
              <Plus /><span className='text-sm ml-4 font-semibold'>ADD NEW ADDRESS</span>
            </button>
          </div>}
          </> : <p className='text-sm w-full block pl-10 sm:pl-12 pr-2 bg-white shadow-md rounded-b-md pb-4 pt-3 text-gray-600'>
              <span className='font-bold text-black'>
                {addressToDeliver?.name} ({addressToDeliver?.phone}) 
              </span>
              {` ${addressToDeliver?.address}`}, {addressToDeliver?.locality}, {addressToDeliver?.landmark && addressToDeliver?.landmark + ','} {addressToDeliver?.district}, {addressToDeliver?.state} - <span className='text-black font-bold'>{addressToDeliver?.pinCode}</span>
          </p>}
    </div>
  )
}




function AddressCard({ address, defaultSelected, setDefaultSelected, setAddressId, setShowCreateForm, setAddresses, setCurrentStep }: { address: Address, defaultSelected: string, setDefaultSelected: React.Dispatch<React.SetStateAction<string>>, setAddressId: React.Dispatch<React.SetStateAction<string>>, setShowCreateForm: React.Dispatch<React.SetStateAction<boolean>>, setAddresses: React.Dispatch<React.SetStateAction<Address[]>>, setCurrentStep: React.Dispatch<React.SetStateAction<'address' | 'summary' | 'payment'>> }) {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [addressUpdateLoading, setAddressUpdateLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue, formState: { errors }, setError, setFocus, reset } = useForm<AddressSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: address.phone,
      name: address.name,
      pinCode: address.pinCode,
      locality: address.locality,
      address: address.address,
      landmark: address.landmark,
      district: address.district,
      state: address.address,
    }
  });
  const pinCode = watch('pinCode');


  useEffect(() => {
    (async () => {
      let regex = new RegExp(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/);

      if (regex.test(pinCode.replaceAll(' ', ''))) {
        setError('pinCode', { message: 'finding' })
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pinCode.replaceAll(' ', '')}`)
        if (response.data[0].Status === 'Success') {
          // console.log(response.data[0])
          setValue('state', response.data[0].PostOffice[0].State)
          setValue('district', response.data[0].PostOffice[0].District)
          setError('pinCode', { message: '' })
        } else {
          setError('pinCode', { message: 'Invalid pin code' })
          setValue('state', '')
          setValue('district', '')
        }
      }
    })()
  }, [pinCode]);


  const onSubmitHandler = async (data: AddressSchema) => {
    if (data.phone.length !== 10) {
      setError('phone', { message: 'Phone number must be 10 digits' })
      setFocus('phone')
      return;
    }
    if (data.pinCode.length !== 6 || errors.pinCode?.message) {
      setError('pinCode', { message: 'Please enter a valid pin code' })
      setFocus('pinCode')
      return;
    }
    setAddressUpdateLoading(true)
    const response = await updateAddress(data, address._id);
    if (response) {
      toast({
        title: 'Address saved',
        description: 'Your address has been saved successfully',
        className: 'bg-green-500 text-white'
      })
      setAddresses(priv => priv.map((addr) => addr._id === response._id ? response : addr));
      setAddressUpdateLoading(false)
      setShowUpdateForm(false)
      setAddressId(response._id);
      setDefaultSelected(response._id);
      reset();
      setCurrentStep('summary');
    } else {
      setAddressUpdateLoading(false)
      toast({
        title: 'Error',
        description: 'Error saving address',
        variant: 'destructive'
      })
    }
  }


  return (
    <>
      {
        (!showUpdateForm || defaultSelected !== address._id) ?
          <div className={`border-gray-300 px-4 py-3 sm:px-8 ${defaultSelected === address._id && "bg-blue-50"}`}>
            <div className='flex flex-nowrap justify-between'>

              <label onClick={() => {
                setDefaultSelected(address._id)
                setShowCreateForm(false)
              }} htmlFor={address._id}
                className='flex flex-nowrap justify-start items-center cursor-pointer w-[85%]'>
                <input type="radio" checked={defaultSelected === address._id} readOnly id={address._id}
                  className='w-4 h-4'
                />
                <label htmlFor={address._id} className='ml-2 text-xs sm:text-sm w-full block cursor-pointer'>
                  <span className='font-semibold'>{address.name}</span>
                  <span className='ml-3 font-bold'>
                    {`(${address.phone})`}
                  </span>
                </label>
              </label>
              {defaultSelected === address._id &&
                <button onClick={() => setShowUpdateForm(true)}
                  className='w-[15%] text-right'>
                  <span className='text-blue-600 font-bold sm:text-sm text-xs'>EDIT</span>
                </button>}
            </div>

            <label htmlFor={address._id} onClick={() => {
              setDefaultSelected(address._id)
              setShowCreateForm(false)
            }}
              className='cursor-pointer text-xs sm:text-sm w-full block px-6 py-2 text-gray-600'
            >
              {address.address}, {address.locality}, {address.landmark && address.landmark + ','} {address.district}, {address.state} - <span className='text-black font-bold'>{address.pinCode}</span>
            </label>
            {defaultSelected === address._id &&
              <button onClick={() => {
                setAddressId(address._id)
                setCurrentStep('summary')
              }}
                className='ml-6 mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-5 text-sm h-12 font-bold rounded-sm'>
                DELIVER HERE
              </button>}
          </div> :
          <>
            <div className='flex flex-nowrap justify-start items-center pl-4 sm:pl-8 py-4 bg-blue-50'>
              <input type="radio" name="sample" checked readOnly className='w-4 h-4' />
              <span className='text-blue-600 ml-3'>
                EDIT ADDRESS
              </span>
            </div>
            <form className='w-full p-4 relative rounded-md sm:px-8 bg-blue-50 shadow-md' onSubmit={handleSubmit(onSubmitHandler)}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='name'>Full Name</Label>
                  <Input {...register('name', { required: true })} required type='text' id='name'
                    placeholder='Your full name'
                    className='w-full bg-gray-50' />
                </div>
                <div>
                  <Label htmlFor='phone'>Phone</Label>
                  <Input {...register('phone', { required: true })} required type='number' id='phone'
                    placeholder='Your 10-digit mobile number'
                    className='w-full bg-gray-50' />
                  {errors.phone && <p className='text-red-600 text-xs px-2'>{errors.phone.message}</p>}
                </div>
                <div>
                  <Label htmlFor='pinCode'>Pin Code</Label>
                  <Input {...register('pinCode', { required: true })} required type='number' id='pinCode'
                    placeholder='Your 6-digit pin code'
                    className='w-full bg-gray-50' />
                  {errors.pinCode && <div className='px-2'>{errors.pinCode.message === 'finding' ? <div className='flex mt-1 flex-nowrap items-center justify-start'><span className='spinner w-6 h-6'></span><span className='ml-2 text-gray-500 text-xs'>Finding...</span></div> :
                    <span className='text-red-600 text-xs'>{errors.pinCode.message}</span>}</div>}
                </div>
                <div>
                  <Label htmlFor='locality'>Locality <span className='text-gray-500'>{'(village/town/city)'}</span></Label>
                  <Input {...register('locality', { required: true })} required type='text' id='locality'
                    placeholder='Your area, street, colony, etc.'
                    className='w-full bg-gray-50' />
                </div>
                <div>
                  <Label htmlFor='address'>Full Address</Label>
                  <Textarea {...register('address', { required: true })} required id='address'
                    placeholder='House no., building name, street name, etc.'
                    className='w-full bg-gray-50' />
                </div>
                <div>
                  <Label htmlFor='landmark'>Landmark <span className='text-gray-500'>{'(Optional)'}</span></Label>
                  <Input {...register('landmark')} type='text' id='landmark'
                    placeholder='Nearby landmark'
                    className='w-full bg-gray-50' />
                </div>
                <div>
                  <Label htmlFor='district'>District</Label>
                  <Input {...register('district', { required: true })} required type='text' id='district'
                    placeholder='Your district'
                    className='w-full bg-gray-50' />
                </div>
                <div>
                  <Label htmlFor='state'>State</Label>
                  <Input {...register('state', { required: true })} required type='text' id='state'
                    placeholder='Your state'
                    className='w-full bg-gray-50' />
                </div>
              </div>
              <button type='submit'
                className='bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm text-white py-2 px-5 mt-5 h-12 font-bold rounded-sm'>
                SAVE AND DELIVER HERE
              </button>
              <Button variant='outline' type='button' onClick={() => setShowUpdateForm(false)}
                className='ml-2 h-12 text-blue-600 font-bold text-xs sm:text-sm'
              >
                Cancle
              </Button>
              {addressUpdateLoading && <div className=' absolute top-0 left-0 h-full w-full z-20 bg-black/40 grid place-content-center'>
                <div className='loader2'></div>
              </div>}
            </form></>}
    </>
  )
}