import React, { useContext } from 'react';
import { useLoaderData } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider/AuthProvider';

const Checkout = () => {
    const { _id, title, price } = useLoaderData();
    const { user } = useContext(AuthContext);

    const handlePlaceOrder = event => {
        event.preventDefault();
        const form = event.target;
        const name = `${form.firstName.value} ${form.lastName.value}`;
        const email = user?.email || 'unregistered';
        const message = form.message.value;
        const phone = form.phone.value;

        const order = {
            service: _id,
            serviceName: title,
            price: price,
            customerName: name,
            email: email,
            phone: phone,
            message: message
        }


        fetch('https://genius-car-server-five-psi.vercel.app/orders', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('geniusToken')}`

            },
            body: JSON.stringify(order)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.acknowledged) {
                    alert('Order placed successfully');
                    form.reset();
                }

            })
            .catch(err => console.error(err));
    }

    return (
        <div>
            <form onSubmit={handlePlaceOrder}>
                <h2 className="text-4xl">
                    You are about to order : {title}
                </h2>
                <h4 className="text-3xl">Price : {price}</h4>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    <input name='firstName' type="text" placeholder="First Name" className="input input-bordered input-ghost w-full" />
                    <input name='lastName' type="text" placeholder="Last Name" className="input input-bordered input-ghost w-full" />
                    <input name='phone' type="text" placeholder="Your phone" className="input input-bordered input-ghost w-full" required />
                    <input name='email' type="text" placeholder="Your email" defaultValue={user?.email} readOnly className="input input-bordered input-ghost w-full" />
                </div>
                <textarea name='message' className='textarea textarea-bordered h-24 w-full' placeholder='Your message' required></textarea>

                <input className='btn' type="submit" value="Place your order" />

            </form>
        </div>
    );
};

export default Checkout;