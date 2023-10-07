function greet() { 
    return `
    /**
    * @swagger
    * /api/auth/login:
    *   post:
    *     summary: Admin Login Section
    *     description: Admin can log in with these details.
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               email:
    *                 type: string
    *                 example: admin@gmail.com
    *               password:
    *                 type: string
    *                 example: 1234
    *     responses:
    *       200:
    *         description: Authentication successful
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 token:
    *                   type: string
    *                 admin_authorization:
    *                   type: object
    *                   properties:
    *                     id:
    *                       type: integer
    *       401:
    *         description: Incorrect email or password
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message:
    *                   type: string
    *       500:
    *         description: Internal Server Error
    */
   `;
  }
  
  // Export the function
  module.exports = greet;