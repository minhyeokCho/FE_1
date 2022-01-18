import React, {useEffect} from 'react';

const User = React.memo(function User({user, onRemove, onToggle}){
	const {username, email, id, active} = user;
	// useEffect(() =>{
	// 	//마운트될때
	// 	console.log('컴포넌트가 화면에 나타남');

	// 	return () => {
	// 		console.log('컴포넌트가 화면에 사라짐')
	// 	}
	// }, [])

	useEffect(()=>{
		console.log('user 바뀌ㄱ기전');
		console.log(user);
		return () => {
			console.log('user 설정됨');
			console.log(user)
		}
	}, [user])
	return(
		<div>
			<b
			onClick={() => onToggle(id)}
			style={{
				color:active ? 'green' : 'black',
				cursor : 'pointer'
			}} >
				{username}
			</b>
			&nbsp;
			<span>
				({email})
			</span>
			<button onClick={() => onRemove(id)} >삭제</button>
		</div>
	)
});

function UserList( {users, onRemove, onToggle}){

	return (
		<div>
			{
				users.map(
					(user) => (
						<User
						user={user} key={user.id} onRemove={onRemove} onToggle={onToggle}
						/>
					)
				)
			}
		</div>
	);
}

export default React.memo(UserList);

//렌더링된 함수 결과를 재사용 React.memo