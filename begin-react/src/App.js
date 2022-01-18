import React, {useRef,useMemo, useReducer, useCallback} from 'react';
// import Hello from './Hello.js';
import './App.css';
// import Wrapper from './Wrapper.js';
// import InputSample from './inputSample.js';
import CreateUser from './createUser.js'
import UserList from './useList.js'

//useMemo
//특정값이 바뀌었을때만 연산을 처리

//reducer
//상태를 업데이트 하는 함수
//const [number, dispatch] = useReducer (reducer, 0);
//number = 상태, dispatch=액션발생시키다 // reducer = 함수 // 0=기본값

function countActiveUsers(users){
	console.log('활성 사용자 수를 세는중..');

	return users.filter(user => user.active).length;
}

const initialState = {
	inputs : {
		username:'',
		email:'',
	},
	users :[
		{
			id:1,
			username:'velpl',
			email: 'opublic.ver@gamil.com',
			active : true,
		},
		{
			id:2,
			username:'velpl222',
			email: 'opublic333.ver@gamil.com',
			active : false,
		},
		{
			id:333,
			username:'velpl333',
			email: 'opublic2222.ver@gamil.com',
			active : false,
		}
	],
}

function reducer (state, action){
	switch (action.type){
		case 'CHANGE_INPUT':
			return {
				...state,
				inputs:{
					...state.inputs,
					[action.name]:action.value
				}
			};
		case 'CREATE_USER':
			return {
				inputs:{
					inputs:initialState.inputs,
					users:state.users.concat(action.user)
				}
			};
		case 'TOGGLE_USER':
			return{
				...state,
				users:state.users.map(user =>
					user.id ===action.id
					? {...user, active : !user.active }
					: user
					)
			}
		case 'REMOVE_USER':
			return{
				...state,
				users:state.users.filter(user => user.id !== action.id)

			}
		default:
			throw new Error('action')
	}
}

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const {users} =state;
	const nextId = useRef(4);
	const {username, email} = state.inputs;

	const onChange= useCallback(e => {
		const {name, value} = e.target;
		dispatch({
			type: 'CHANGE_INPUT',
			name,
			value,
		})
	},[]);

	const onCreate = useCallback(() =>{
		dispatch({
			type:'CREATE_USER',
			user:{
				id: nextId.current,
				username,
				email
			}
		});
		nextId.current += 1;
	},[username, email])

	const onToggle = useCallback(id =>{
		dispatch({
			type: 'TOGGLE_USER',
			id
		})
	}, []);

	const onRemove = useCallback(id =>{
		dispatch({
			type: 'REMOVE_USER',
			id
		});
	}, []);

	const count = useMemo (() => countActi)

	return (
		<>
			<CreateUser username={username} email={email} onChange={onChange} onCreate={onCreate}
			/>
			<UserList users ={users} onToggle={onToggle} onRemove={onRemove}/>
			<div>활성 사용자수 : 0 </div>
		</>
	);
}

export default App;
