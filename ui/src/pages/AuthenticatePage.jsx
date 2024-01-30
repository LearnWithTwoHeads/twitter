import { Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useAuth } from "../providers/AuthProvider";
import { Input } from "../components/forms/Input";

export const AuthenticatePage = () => {
  const { handleLogin, handleSignup } = useAuth();

  return (
    <div>
      <div className="absolute md:top-1/3 md:w-full md:m-0 mx-8">
        <div className="md:flex md:justify-around md:mt-0 mt-16">
          <div className="md:text-5xl text-xl italic font-bold">
            Yoofi's Twitter Clone
          </div>
          <div className="flex flex-col md:mt-0 mt-12">
            <div className="md:text-7xl text-6xl font-bold font-mono">
              Happening now
            </div>
            <div className="mt-4 md:text-3xl text-2xl font-bold font-mono">
              Join today.
            </div>
            <div className="mt-4">
              <button
                className="btn md:btn-wide w-full rounded-full bg-sky-300 hover:bg-sky-500 text-white"
                onClick={() =>
                  document.getElementById("sign_up_modal").showModal()
                }
              >
                Sign Up
              </button>
              <dialog id="sign_up_modal" className="modal">
                <Formik
                  initialValues={{
                    email: "",
                    firstName: "",
                    lastName: "",
                    username: "",
                    password: "",
                    reenterPassword: "",
                    birthDate: "",
                  }}
                  validationSchema={Yup.object({
                    username: Yup.string()
                      .min(8, "Username must be at least 8 characters")
                      .required("Required"),
                    email: Yup.string()
                      .email("Invalid email address")
                      .required("Required"),
                  })}
                  validateOnBlur={false}
                  validateOnChange={false}
                  validate={(values) => {
                    const errors = {};

                    if (values.password !== values.reenterPassword) {
                      errors.reenterPassword = "Passwords must match";
                    }

                    return errors;
                  }}
                  onSubmit={async (values) => {
                    await handleSignup({
                      email: values.email,
                      firstName: values.firstName,
                      lastName: values.lastName,
                      username: values.username,
                      password: values.password,
                      birthDate: values.birthDate,
                    });
                  }}
                >
                  {({ handleSubmit, handleChange, values }) => (
                    <div className="modal-box">
                      <form
                        className="flex flex-col items-center mt-4"
                        onSubmit={handleSubmit}
                      >
                        <div className="label text-center font-bold text-3xl mb-8">
                          Sign Up
                        </div>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Email"
                          className="input w-full border-black"
                          onChange={handleChange}
                          value={values.email}
                        />
                        <div className="flex w-full space-x-4 mt-4">
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="First Name"
                            className="input w-full border-black"
                            onChange={handleChange}
                            value={values.firstName}
                          />
                          <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Last Name"
                            className="input w-full border-black"
                            onChange={handleChange}
                            value={values.lastName}
                          />
                        </div>
                        <Input
                          id="birthDate"
                          name="birthDate"
                          type="date"
                          placeholder="Birth Date"
                          className="input w-full border-black mt-4"
                          onChange={handleChange}
                          value={values.birthDate}
                        />
                        <Input
                          id="username"
                          name="username"
                          type="text"
                          placeholder="Username"
                          className="input w-full border-black mt-4"
                          onChange={handleChange}
                          value={values.username}
                        />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Password"
                          className="input w-full border-black mt-4"
                          onChange={handleChange}
                          value={values.password}
                        />
                        <Input
                          id="reenterPassword"
                          name="reenterPassword"
                          type="password"
                          placeholder="Re-enter Password"
                          className="input w-full border-black mt-4"
                          onChange={handleChange}
                          value={values.reenterPassword}
                        />
                        <div className="mt-8">
                          <button type="submit" className="btn">
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </Formik>
              </dialog>
            </div>
            <div className="mt-8">
              <div className="text-lg font-bold">Already have an account?</div>
              <button
                className="mt-4 btn md:btn-wide w-full rounded-full text-sky-300 bg-white hover:bg-sky-50"
                onClick={() =>
                  document.getElementById("log_in_modal").showModal()
                }
              >
                Log In
              </button>
              <dialog id="log_in_modal" className="modal">
                <Formik
                  initialValues={{
                    loginUsername: "",
                    loginPassword: "",
                  }}
                  validateOnBlur={false}
                  validateOnChange={false}
                  onSubmit={async (values) => {
                    try {
                      await handleLogin(
                        values.loginUsername,
                        values.loginPassword
                      );
                    } catch (error) {
                      toast.error(error.message);
                    }
                  }}
                >
                  {({ handleChange, handleSubmit, values }) => (
                    <div className="modal-box">
                      <form
                        className="flex flex-col items-center mt-4"
                        onSubmit={handleSubmit}
                      >
                        <div className="label text-center font-bold text-3xl mb-8">
                          Log In
                        </div>
                        <Input
                          id="loginUsername"
                          name="loginUsername"
                          type="text"
                          placeholder="Username"
                          className="input w-full border-black"
                          onChange={handleChange}
                          value={values.loginUsername}
                        />
                        <Input
                          id="loginPassword"
                          name="loginPassword"
                          type="password"
                          placeholder="Password"
                          className="input w-full border-black mt-4"
                          onChange={handleChange}
                          value={values.loginPassword}
                        />
                        <div className="mt-8">
                          <button type="submit" className="btn">
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </Formik>
              </dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
