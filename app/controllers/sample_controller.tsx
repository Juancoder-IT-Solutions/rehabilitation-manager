class SampleController {
    constructor(){
        console.log("successfully loaded sample controller")
    }

    async sample_api(){
        try {
            const response = await fetch('http://localhost/out/test.php', {
              method: 'POST',  // Use POST method
              headers: {
                'Content-Type': 'application/json',  // We are sending JSON data
              },
              body: JSON.stringify({ test: 1 }),  // Send name as JSON in the body
            });
      
            const data = await response.json();  // Parse the JSON response
            return data
        } catch (error) {
            console.error('Error fetching data:', error);
            return error
        }
    }
}

let sampleController = new SampleController
export default sampleController