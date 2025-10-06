import React, { useState } from 'react';
import './app.css';
import StandardInput from './components/Form.tsx';
import Button from './components/Button.tsx';

export default function App() {
  const [name, setName] = useState("");

  return (
    <div className="bg-[#121212] min-h-screen flex flex-col items-center justify-center p-8 space-y-6">
      <StandardInput label="User" value={name} onChange={setName} />
      
      <Button variant="contained" Icon={<span>➡️</span>}>
      Send
      </Button>

    </div>
  );
}