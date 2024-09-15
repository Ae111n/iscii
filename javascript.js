// Request microphone access and set up audio context
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        // Set up audio data properties
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);

        // Update 3D object based on audio data
        function animate() {
            requestAnimationFrame(animate);

            // Get frequency data
            analyser.getByteFrequencyData(dataArray);

            // Calculate average frequency value
            const averageFrequency = dataArray.reduce((sum, value) => sum + value) / bufferLength;

            // Modify the cube size based on frequency
            const scale = averageFrequency / 50; // Adjust the divisor for sensitivity
            cube.scale.set(scale, scale, scale);

            renderer.render(scene, camera);
        }

        animate();
    })
    .catch(function(err) {
        console.error('Microphone access denied', err);
    });
