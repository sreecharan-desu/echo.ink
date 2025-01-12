export const homepage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
      <title>Welcome to echo.ink</title>
      <style>
        body {
          background: #000;
          color: #fff;
          font-family: "Courier Prime", serif;
          font-weight: 400;
          font-style: normal;          
          text-align: center;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        h1 {
          font-size: 4rem;
          margin: 0;
          letter-spacing: 2px;
          text-shadow: 2px 2px 5px rgba(255, 255, 255, 0.2);
        }
        hr {
          width: 50%;
          border: none;
          height: 2px;
          background: linear-gradient(to right, #000, #fff, #000);
          margin: 1.5rem auto;
        }
        .tagline {
          font-size: 1.2rem;
          font-weight: 300;
          color: #ddd;
          opacity: 0.9;
        }
        .container {
          border: 2px solid #fff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
          animation: fadeIn 2s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .footer {
          position: absolute;
          bottom: 10px;
          width: 100%;
          font-size: 0.8rem;
          color: #888;
          text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.1);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to echo.ink</h1>
        <hr />
        <p class="tagline">Where your ideas resonate, and the ink flows endlessly.</p>
      </div>
      <div class="footer">© 2025 echo.ink. All rights reserved.</div>
    </body>
    </html>
`

export const status_404 = `
<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to echo.ink</title>
      <style>
        body {
          background: #000;
          color: #fff;
          font-family: "Courier Prime", serif;
          font-weight: 400;
          font-style: normal;          
          text-align: center;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        h1 {
          font-size: 4rem;
          margin: 0;
          letter-spacing: 2px;
          text-shadow: 2px 2px 5px rgba(255, 255, 255, 0.2);
        }
        hr {
          width: 50%;
          border: none;
          height: 2px;
          background: linear-gradient(to right, #000, #fff, #000);
          margin: 1.5rem auto;
        }
        .tagline {
          font-size: 1.2rem;
          font-weight: 300;
          color: #ddd;
          opacity: 0.9;
        }
        .container {
          border: 2px solid #fff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
          animation: fadeIn 2s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .footer {
          position: absolute;
          bottom: 10px;
          width: 100%;
          font-size: 0.8rem;
          color: #888;
          text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.1);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>404 _NOT_FOUND_</h1>
        <hr />
        <p class="tagline">The page you are trying to access doesn't exist.</p>
      </div>
      <div class="footer">© 2025 echo.ink. All rights reserved.</div>
    </body></html>
` 