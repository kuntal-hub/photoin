import React from 'react'
import ReviewCard from './ReviewCard';

export default function ReviewGalary({ reviews, adminDelete=false }: { reviews: Review[], adminDelete?: boolean }) {
    function spliteArr(mainArr: Review[]): Review[][] {

        if (!mainArr || mainArr.length === 0) return [[], [], [], []];

        const divisionCount = Math.floor(mainArr.length / 4);
        let arr1, arr2, arr3, arr4;
        const extraArr = mainArr.slice(divisionCount * 4, mainArr.length);
        arr1 = mainArr.slice(0, divisionCount);
        arr2 = mainArr.slice(divisionCount, divisionCount * 2);
        arr3 = mainArr.slice(divisionCount * 2, divisionCount * 3);
        arr4 = mainArr.slice(divisionCount * 3, divisionCount * 4);
        if (extraArr.length === 1) {
            arr1.push(extraArr[0]);
        } else if (extraArr.length === 2) {
            arr1.push(extraArr[0]);
            arr2.push(extraArr[1]);
        } else if (extraArr.length === 3) {
            arr1.push(extraArr[0]);
            arr2.push(extraArr[1]);
            arr3.push(extraArr[2]);
        }
        return [arr1, arr2, arr3, arr4]
    }

    const [arr1, arr2, arr3, arr4] = spliteArr(reviews);

    return (
        <div className='w-full'>
            <div className="row">
                <div className="column">
                    {arr1.map((review, index) => <ReviewCard key={index} review={review} adminDelete={adminDelete} />)}
                </div>
                <div className="column">
                    {arr2.map((review, index) => <ReviewCard key={index} review={review} adminDelete={adminDelete} />)}
                </div>
                <div className="column">
                    {arr3.map((review, index) => <ReviewCard key={index} review={review} adminDelete={adminDelete} />)}
                </div>
                <div className="column">
                    {arr4.map((review, index) => <ReviewCard key={index} review={review} adminDelete={adminDelete} />)}
                </div>
            </div>
        </div>
    )
}
