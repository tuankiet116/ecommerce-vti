<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Shopera API</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html,
        body {
            height: 100%;
            font-family: 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #f0f4f8, #ffffff);
            color: #222;
        }

        body {
            display: flex;
            flex-direction: column;
        }

        main {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .wrapper {
            max-width: 800px;
            width: 100%;
            padding: 40px;
            background: white;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            text-align: center;
        }

        h1 {
            font-size: 2.75rem;
            background: linear-gradient(90deg, #27ae60, #2ecc71);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
        }

        p {
            font-size: 1.15rem;
            color: #555;
            margin-bottom: 30px;
        }

        .btn {
            display: inline-block;
            padding: 14px 28px;
            background-color: #2ecc71;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: background 0.3s ease;
        }

        .btn:hover {
            background-color: #27ae60;
        }

        footer {
            text-align: center;
            padding: 15px 20px;
            font-size: 0.85rem;
            color: #777;
            background-color: #f4f4f4;
        }
    </style>
</head>

<body>

    <main>
        <div class="wrapper">
            <h1>Shopera API</h1>
            <p>
                Empower your e-commerce innovations with Shopera’s powerful and easy-to-use API suite.
                Build custom storefronts, automate operations, and integrate with world-class tools.
            </p>
            <a href="#" class="btn">View API Docs</a>
        </div>
    </main>

    <footer>
        &copy; 2025 Shopera, All rights reserved.
    </footer>

</body>

</html>
