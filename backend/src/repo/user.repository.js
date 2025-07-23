import { getDB } from "../config/mongodb.js";
// import { ownerIdToEmp } from "../Pipelines/ownerIdToEmp.pipeline.js";

export default class UserRepository {
  constructor() {
    this.collection = "User";
  }

  /**
   * Sign up a new user with optional transaction support
   * @param {Object} newUser - The new user data to be inserted
   * @param {Object} session - MongoDB session (optional, for transactions)
   */
  async signUp(newUser, session = null) {
    try {
      const db = await getDB();
      const collection = await db.collection(this.collection);

      // If session is provided, pass it to the insertOne method
      if (session) {
        const data = await collection.insertOne(newUser, { session });
      } else {
        await collection.insertOne(newUser);
      }
      return {
        status: "ok",
        message: "success",
        data: newUser,
      };
    } catch (err) {
      console.log(err);
      return {
        status: "err",
        message: err,
        data: {},
      };
      // throw new ApplicationError("Something went wrong during sign-up", 500);
    }
  }

  /**
   * Find a user by their employee code with optional transaction support
   * @param {string} employeeCode - The employee code to search for
   * @param {Object} session - MongoDB session (optional, for transactions)
   */
  async findByEmployeeCode(employeeCode, session = null) {
    try {
      const db = await getDB();
      const collection = await db.collection(this.collection);

      // If session is provided, use it in the query
      if (session) {
        return {
          status: "ok",
          message: "Success",
          data: await collection.findOne({ employeeCode }, { session }),
        };
      } else {
        return {
          status: "ok",
          message: "Success",
          data: await collection.findOne({ employeeCode }),
        };
      }
    } catch (err) {
      // throw new ApplicationError(
      //   "Something went wrong during employee search",
      //   500
      // );
      return {
        status: "err",
        message: err,
        data: {},
      };
    }
  }

  /**
   * Run multiple operations within a transaction
   * @param {Function} operations - A callback containing the operations to run in the transaction
   */
  async withTransaction(operations) {
    const db = await getDB();
    const session = await db.client.startSession();

    try {
      let result;

      await session.withTransaction(async () => {
        result = await operations(session); // Pass the session to operations
      });

      return result;
    } catch (err) {
      throw new ApplicationError("Transaction failed", 500);
    } finally {
      await session.endSession();
    }
  }
}

