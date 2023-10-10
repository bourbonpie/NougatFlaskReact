import React, { useState } from 'react';
import './App.css';

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

        // Fetch the success of file uploading

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

    const getNougatData = () => {
        fetch('http://127.0.0.1:3400/upload_image_path', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Nougat data received successfully.', data)
        })
        .catch(error => console.error("ERROR GETTING DATA: ", error))
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
    
        <div className="container">
        <h1 className="title">iGrader</h1>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="file">Upload Document</label>
                <input 
                type="file" id="file" accept="pdf" name="file" required onChange={handleFileChange}
                />
                <button onClick={handleUpload}>Upload File</button>
            </div>
            <div className="form-group">
                <label for="rubric1">Full Score</label>
                <input type="number" min="1" id="rubric1" name="rubrics[]" placeholder="Full Score" required/>
            </div>
            <div className="form-group">
                <label for="rubric2">Rubric 1</label>
                <input type="text" id="rubric2" name="rubrics[]" placeholder="Rubric 2" required/>
            </div>
            <div className="form-group">
                <label for="rubric3">Rubric 2</label>
                <input type="text" id="rubric3" name="rubrics[]" placeholder="Rubric 3" required/>
            </div>
            <div className="form-group">
                <label for="rubric4">Rubric 3</label>
                <input type="text" id="rubric4" name="rubrics[]" placeholder="Rubric 4" required/>
            </div>
            <div className="form-group">
                <label for="rubric5">Rubric 4</label>
                <input type="text" id="rubric5" name="rubrics[]" placeholder="Rubric 5" required/>
            </div>
            <button type="submit">Grade Document</button>
        </form>
        <footer className="footer">Designed by <a href="https://github.com/fullmoonemptysun">fullmoonemptysun/</a></footer>
    </div>
    )
}

export default FileUpload;