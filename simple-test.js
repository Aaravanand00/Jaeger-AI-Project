/**
 * Simple test to verify query translation works
 */

async function test() {
    try {
        const response = await fetch('http://localhost:3000/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: 'show me slow requests in payment service'
            }),
        });

        const result = await response.json();
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

test();
