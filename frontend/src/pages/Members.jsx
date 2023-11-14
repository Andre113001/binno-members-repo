import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import Button from '../components/Button/Button';


function Members() {
    const [data, setData] = useState([])

    useEffect(() => {
        fetch('http://localhost:3001/get')
        .then(res => res.json())
        .then(data => setData(data))
        .catch(err => console.log(err));
    }, [])

    return (
        <div>
        <div className='mb-4'>
            <h1 className='heading-1'>Members Page</h1>
            <Link to={"/"}>
                <Button color='btn-blue' text='To Home'/>
            </Link>
        </div>
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item) => (
                <tr key={item.account_id}>
                <td>{item.account_id}</td>
                <td>{item.email}</td>
                <td>{item.name}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    )
}

export default Members
