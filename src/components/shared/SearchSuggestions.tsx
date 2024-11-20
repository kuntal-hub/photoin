'use client';
import { Search } from 'lucide-react'
import React from 'react'


function SearchItem({
    itemText,
    searchText,
    className='flex flex-nowrap justify-start pt-1 pb-2 text-sm pl-3 pr-1 w-full rounded-lg hover:bg-gray-200',
    onClick
}:{itemText:string,searchText:string,className?:string,onClick:()=> void}){
    let firstHalf,secondHalf,matchedIndex,matchedText

    matchedIndex = itemText.toLowerCase().indexOf(searchText.toLowerCase().trim())
    if (matchedIndex === -1) {
        if (searchText.includes(itemText)) {
            matchedText = itemText
            firstHalf = ''
            secondHalf = ''
        } else {
            firstHalf = itemText,
            secondHalf = ''
            matchedText = ''
        }
    } else {
        firstHalf = itemText.slice(0,matchedIndex)
        secondHalf = itemText.slice(matchedIndex + searchText.length,itemText.length)
        matchedText = searchText;
    }

return (
<button
className={className}
onClick={onClick}
>
    <Search className="mr-2 mt-1 h-4 w-4" />
    <span>
        {firstHalf}
        <span className="font-bold">{matchedText}</span>
        {secondHalf}
    </span>
</button>
)}

export {SearchItem}


