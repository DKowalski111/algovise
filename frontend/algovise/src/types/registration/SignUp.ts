class SignUp {
  name:string;
  email:string;
  password;
  constructor(name:string, email:string, password:string){
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

export default SignUp;