import Api from '@/services/Api'

export default {
    upload(formData) {
        return Api().post('upload', formData)
            .then(response => {
                console.log('Upload successful:', response.data);
            })
            .catch(error => {
                if (error.response) {
                    // Server responded with a status code out of range of 2xx
                    console.error('Upload error:', error.response.data, error.response.status);
                } else if (error.request) {
                    // Request was made but no response received
                    console.error('No response received:', error.request);
                } else {
                    // Something happened in setting up the request
                    console.error('Error in setting up the request:', error.message);
                }
            });
    },
    
    delete(picture) {
        return Api().post('/upload/delete', picture)
            .catch(error => {
                console.error('Delete error:', error);
            });
    }
}
