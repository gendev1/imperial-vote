import { Radio, RadioGroup, Stack, label } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { useState, setValue } from "react";
import Header from '../header';

export default function Vote() {
    const [value, setValue] = useState('1')

    return (
        <main className='bg-yellow-200'>
      <div className="bg-yellow-200">
        <Header></Header>
        <div className="relative isolate px-6 pt-14 lg:px-4">
          <div className="text-center">

            <label>Select your Poll</label>
            <RadioGroup className="text-center" onChange={setValue} value={value}>
                <Stack className="text-center" direction='Poll'>
                    <Radio className="ml-5" value='1'>Yes</Radio>
                    <Radio className="ml-5" value='2'>No</Radio>
                    <Radio className="ml-5" value='3'>Abstain</Radio>
                </Stack>
            </RadioGroup>
            <Button colorScheme='blue'>Submit</Button>
          </div>
        </div>
      </div>
    </main>
    )
}