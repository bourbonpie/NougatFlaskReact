import React, { useState } from 'react';

const FileUpload = () => {
    const [file, setFile] = useState('')

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (!file) {
            alert('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('files[]', file);

        fetch('http://127.0.0.1:3400/upload_image_path', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('File uploaded successfully: ', data);
        })
        .catch(error => console.error('ERROR UPLOADING FILE: ', error)) 
    };

    return (
        <div>
            <input type='file' accept='pdf' onChange={handleFileChange}></input>
            <button onClick={handleUpload}>Upload file</button>
        </div>
    )
}

export default FileUpload;

