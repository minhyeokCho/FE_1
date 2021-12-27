import React, {useRef} from 'react';
import Hello from './Hello.js';
import './App.css';
import Wrapper from './Wrapper.js';
// import InputSample from './inputSample.js';
import UserList from './useList.js'

function App() {
  const users = [
		{
			id:1,
			username:'velpl',
			email: 'opublic.ver@gamil.com'
		},
		{
			id:2,
			username:'velpl222',
			email: 'opublic333.ver@gamil.com'
		},
		{
			id:3333,
			username:'velpl333',
			email: 'opublic2222.ver@gamil.com'
		}
	];

  const nextId = useRef(4);

  const onCreate = () => {
    console.log(nextId.current);
    nextId.current += 1;
  }


  return (
    <>
    <UserList users ={users}>

    </UserList>
    </>
  );
}

export default App;
