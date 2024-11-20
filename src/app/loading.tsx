import React from 'react';

const Loader = () => {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className='h-24'>

                <div className="loader5"></div>
            </div>
            <div className='loader6 hidden'></div>
            <p className='block font-semibold text-lg'>
                Loading...
            </p>
        </div>
    );
};

export default Loader;
