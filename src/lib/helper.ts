export function getPublicId({url}:{url:string}):string {
    const publicId = url.split('/').pop()?.split('.')[0];
    return publicId!;
}

export function getRandomName():string {
    const indianNamesWithTitles = [
        'Aarav Sharma', 'Vivaan Patel', 'Aditya Gupta', 'Vihaan Rao', 'Arjun Mehta', 'Sai Kumar', 'Ayaan Shah', 'Reyansh Verma',
        'Ishaan Agarwal', 'Karthik Reddy', 'Aadhya Nair', 'Saanvi Joshi', 'Ananya Singh', 'Kavya Menon', 'Isha Iyer', 'Aisha Sinha',
        'Diya Kapoor', 'Aarohi Sharma', 'Meera Desai', 'Ishita Choudhury', 'Riya Pandey', 'Tanya Prasad', 'Naina Sethi', 'Shruti Sharma',
        'Pooja Rani', 'Radhika Mittal', 'Neha Agarwal', 'Sanya Shah', 'Kriti Verma', 'Sanya Yadav', 'Aditi Rao', 'Anaya Gupta',
        'Srishti Bhatia', 'Khushi Mehta', 'Aarini Kapoor', 'Nikita Sharma', 'Shreya Patel', 'Mira Jain', 'Sia Kapoor', 'Suman Singh',
        'Kabir Joshi', 'Aryan Reddy', 'Laksh Agarwal', 'Rohan Menon', 'Ayaan Patel', 'Neil Desai', 'Harsh Sharma', 'Raghav Rao',
        'Shiv Yadav', 'Om Sethi', 'Ananya Singh', 'Ritika Iyer', 'Aarav Kapoor', 'Arya Rani', 'Priti Sharma', 'Tanvi Gupta',
        'Payal Mehta', 'Nidhi Patel', 'Swara Reddy', 'Simran Choudhury', 'Raj Kumar', 'Vikram Agarwal', 'Siddharth Sharma', 'Ravi Patel',
        'Kunal Yadav', 'Vishal Desai', 'Manish Gupta', 'Rakesh Shah', 'Sameer Singh', 'Rajan Mittal', 'Kiran Iyer', 'Anil Patel',
        'Rajesh Kumar', 'Deepak Verma', 'Harshad Rao', 'Gaurav Yadav', 'Rohan Sharma', 'Suresh Reddy', 'Nitin Gupta', 'Ajay Patel',
        'Sandeep Verma', 'Arun Yadav', 'Ravi Desai', 'Sanjay Iyer', 'Ashok Shah', 'Amit Patel', 'Vivek Gupta', 'Sanjiv Sharma',
        'Kishore Rao', 'Sandeep Kumar', 'Mohan Sharma', 'Vikram Patel', 'Keshav Desai', 'Bharat Yadav', 'Ravi Iyer', 'Anil Shah',
        'Kapil Verma', 'Rohit Gupta', 'Vijay Sharma', 'Raman Patel', 'Sonam Mehta', 'Komal Sharma', 'Sangeeta Rao', 'Ritu Yadav',
        'Nupur Iyer', 'Preeti Desai', 'Ankita Patel', 'Meenal Choudhury', 'Ishita Rani', 'Gauri Kumar', 'Sunita Gupta', 'Aarti Sharma',
        'Suman Patel', 'Nisha Sharma', 'Shalini Iyer', 'Seema Verma', 'Sangeeta Kumar', 'Neetu Yadav', 'Poonam Gupta', 'Hema Reddy',
        'Madhuri Patel', 'Sonal Shah', 'Sonia Desai', 'Bhavna Sharma', 'Kiran Choudhury', 'Rani Yadav', 'Shubhi Patel', 'Aruna Iyer',
        'Chandini Verma', 'Nandini Gupta', 'Pratibha Reddy', 'Richa Sharma', 'Charul Patel', 'Poonam Kumar', 'Sushma Yadav', 'Jaya Rani',
        'Lata Gupta', 'Sangeeta Patel', 'Suman Kumar', 'Sanjana Desai', 'Tanu Sharma', 'Chandini Gupta', 'Madhavi Reddy', 'Kavita Patel',
        'Ranjana Iyer', 'Komal Sharma', 'Laxmi Yadav', 'Madhavi Patel', 'Nidhi Gupta', 'Kumari Sharma', 'Shradha Reddy', 'Neelam Desai',
        'Tanuja Patel', 'Rekha Iyer', 'Shikha Sharma', 'Shalini Kumar', 'Gargee Patel', 'Vandana Yadav', 'Nikita Gupta', 'Meenal Rani',
        'Pragya Sharma', 'Madhurima Desai', 'Ruchi Patel', 'Amita Gupta', 'Aarti Kumar', 'Neelam Yadav', 'Sunita Sharma', 'Harsha Patel',
        'Parul Desai', 'Nidhi Gupta', 'Divya Reddy', 'Meenakshi Iyer', 'Vaishnavi Patel', 'Srishti Sharma', 'Pooja Desai', 'Himanshi Kumar',
        'Ritika Yadav', 'Hema Sharma', 'Aditi Patel', 'Sonali Gupta', 'Nidhi Sharma', 'Ruchi Patel', 'Rashmi Desai', 'Naina Kumar',
        'Swati Iyer', 'Aarti Gupta', 'Tanu Sharma', 'Ritika Patel', 'Richa Reddy', 'Kavya Sharma', 'Neha Desai', 'Rekha Kumar',
        'Charu Patel', 'Komal Gupta', 'Preeti Sharma', 'Sonia Desai', 'Minal Patel', 'Sushma Yadav', 'Rani Sharma', 'Madhavi Gupta',
        'Sonal Desai', 'Rachna Patel', 'Madhuri Kumar', 'Shilpa Sharma', 'Meenakshi Yadav', 'Seema Patel', 'Nidhi Desai', 'Shubhi Gupta',
        'Nisha Sharma', 'Aishwarya Patel', 'Ankita Kumar', 'Shreya Gupta', 'Gaurav Sharma', 'Harsh Patel', 'Raj Siddharth', 'Sanjeev Gupta',
        'Manoj Yadav', 'Rohit Patel', 'Arjun Sharma', 'Ravi Kumar', 'Amit Desai', 'Kishore Patel', 'Vikram Gupta', 'Amit Sharma',
        'Vivek Kumar', 'Ajay Patel', 'Gaurav Desai', 'Harsh Kumar', 'Siddharth Gupta', 'Rajesh Patel', 'Vijay Sharma', 'Raman Yadav',
        'Sonali Kumar', 'Komal Gupta', 'Pragya Sharma', 'Madhavi Patel', 'Ravi Iyer', 'Tanu Sharma', 'Ruchita Gupta', 'Suman Patel',
        'Kiran Kumar', 'Aarti Sharma', 'Nupur Patel', 'Suman Desai', 'Aditi Gupta', 'Ankita Yadav', 'Priti Sharma', 'Madhavi Gupta',]
    const randomName = indianNamesWithTitles[Math.floor(Math.random() * indianNamesWithTitles.length)];
    return randomName;
}


export const download = (url: string, filename: string) => {
    if (!url) {
      throw new Error("Resource URL not provided! You need to provide one");
    }
  
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobURL = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobURL;
  
        if (filename && filename.length)
          a.download = `${filename.replaceAll(" ", "_")}.png`;
        document.body.appendChild(a);
        a.click();
      })
      .catch((error) => console.log({ error }));
  };


  export const downloadImages = (urls: string[]) => {
    if (!urls || urls.length === 0) {
      throw new Error("Resource URLs not provided! You need to provide at least one.");
    }
    urls.forEach((url, index) => {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch image from ${url}: ${response.statusText}`);
          }
          return response.blob();
        })
        .then((blob) => {
          const blobURL = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobURL;
  
          const filename = `${new Date().toISOString().replaceAll(" ","_")}_${index}.png`;
          a.download = filename;
  
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a); // Clean up after the download
        })
        .catch((error) => console.error({ error }));
    });
  };