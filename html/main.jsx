var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var hashHistory = window.ReactRouter.hashHistory;
var Link = window.ReactRouter.Link;

class ShowPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts:[],  
      username:'',
      guestvisit: false,
    };
    this.getPost = this.getPost.bind(this);
    this.addPost = this.addPost.bind(this);
  }
  componentDidMount(){
    this.getPost();
  }

  getPost(){
    var self = this;
    var name = this.props.params.name;
    axios.post('/getPost', {
      name: this.props.params.name,
    })
    .then(function (response) {
      console.log(response);
      if(response.data==='unauthorized'){
        alert('Please log in');
        hashHistory.push('/');
      }
      else{
        console.log('res is ',response);
        self.setState({posts: response.data});
        self.setState({username: name});
        if(name === 'guest' || name === 'Guest'){
          self.setState({ guestvisit: true });
        }
      } 
    })
    .catch(function (error) {
      console.log('error is ',error);
    });
  }

  updatePost(id){
    console.log('update post', id);
    var name = this.state.username;
    hashHistory.push('/home/'+ name +'/addPost/' + id);
  }

  deletePost(id){
    if(confirm('Are you sure ?')){
      var self = this;
      axios.post('/deletePost', {
        id: id
      })
      .then(function (response) {
        self.getPost();
      })
      .catch(function (error) {
         
      });
    }
  }

  addPost(){
    var name = this.state.username;
    hashHistory.push('/home/'+ name + '/addPost/');
  }

  returnHome(){
    hashHistory.push('/');
    axios.post('/signOut', {
    })
    .then(function (response) {
      console.log('Successfully logged out');
    })
    .catch(function (error) {
      console.log('error is ',error);
    });
  }
  render() {
    return (
      <div>
        <div className="header clearfix">
          <nav>
            <ul className="nav nav-pills pull-right">
              <button type="button" id="homeHyperlink" className="active disabled btn btn-primary" >Home</button>
              <button type="button" id="addHyperLink"  className="btn btn-default" onClick={this.addPost} disabled={this.state.guestvisit}>Add</button>
              <button type="button" id="" className="btn btn-default" onClick={this.returnHome.bind(this)}>Logout</button>
            </ul>
          </nav>
            <h3 className="text-primary">React Blog App</h3>
            <p className="bg-success text-center ">Current User: <strong className="">{this.state.username}</strong></p>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.posts.map(function(post,index) {
                 return <tr key={index} >
                          <td>{index+1}</td>
                          <td>{post.title}</td>
                          <td>
                            <button type="button" className="btn btn-default" disabled={this.state.guestvisit} onClick={this.updatePost.bind(this,post._id)}>
                              <span className="glyphicon glyphicon-pencil" ></span>
                            </button>
                          </td>
                          <td>
                            <button type="button" className="btn btn-default" disabled={this.state.guestvisit} onClick={this.deletePost.bind(this,post._id)}>
                              <span className="glyphicon glyphicon-remove" ></span>
                            </button>
                          </td>
                        </tr>
              }.bind(this))
            }
          </tbody>
        </table>
        <div className="list-group">
        {
              this.state.posts.map(function(post,index) {
                 return <a key={index} className="list-group-item active">
                          <h3 className="list-group-item-heading">{post.title}</h3>
                          <p className="list-group-item-text">{post.subject}</p>
                        </a>
              })
        }
        </div>
      </div>
    )
  }
}

class AddPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title:'',
      subject:'',
      id: '',
      username: '',
    };
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.addPost = this.addPost.bind(this);
    this.getPostWithId = this.getPostWithId.bind(this);
  }
  componentDidMount(){
    this.getPostWithId();
  }

  handleTitleChange(e){
    this.setState({title: e.target.value})
  }
  handleSubjectChange(e){
    this.setState({subject: e.target.value})
  }
  addPost(){
    var self = this;
    axios.post('/addPost', {
      title: this.state.title,
      subject: this.state.subject,
      id: this.state.id
    })
    .then(function (response) {
      console.log('response from add post is ',response);
      var name = self.state.username;
      hashHistory.push('/home/' + name);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  
  getPostWithId(){
    var id = this.props.params.id;
    var name = this.props.params.name;
    var self = this;

    axios.post('/getPostWithId', {
      id: id
    })
    .then(function (response) {
      if(response){
        self.setState({title: response.data.title});
        self.setState({subject: response.data.subject});  
        self.setState({id: id});
        self.setState({username: name});
      }
    })
    .catch(function (error) {
      console.log('error is ',error);
    });
  }
  returnPage(){
    hashHistory.push('/home/' + this.state.username);
  }
  returnHome(){
    hashHistory.push('/');
    axios.post('/signOut', {
    })
    .then(function (response) {
      console.log('Successfully logged out');
    })
    .catch(function (error) {
      console.log('error is ',error);
    });
  }

  render() {
    return (
      <div>
        <div className="header clearfix">
          <nav>
            <ul className="nav nav-pills pull-right">
              <button type="button" id="homeHyperlink" className="btn btn-default" onClick={this.returnPage.bind(this)}>Home</button>
              <button type="button" id="addHyperLink"  className="active disabled btn btn-primary" >Add</button>
              <button type="button" id="" className="btn btn-default" onClick={this.returnHome.bind(this)}>Logout</button>
            </ul>
          </nav>
        <h3 className="text-muted">React Blog App</h3>
      </div>

      <div className="col-md-5">
        <div className="form-area">  
            <form role="form">
            <br styles="clear:both" />
              <div className="form-group">
                <input value={this.state.title} type="text" onChange={this.handleTitleChange} className="form-control" id="title" name="title" placeholder="Title" required />
              </div>
              
              <div className="form-group">
              <textarea value={this.state.subject} className="form-control" onChange={this.handleSubjectChange} type="textarea" id="subject" placeholder="Subject" maxlength="140" rows="7"></textarea>
              </div>
                 
            <button type="button" onClick={this.addPost} id="submit" name="submit" className="btn btn-primary pull-right">Add Post</button>
            </form>
        </div>
      </div>
      </div>
    )
  }
}

class Signin extends React.Component {
    constructor(props) {
        super(props);        
        this.state = {
          email:'',
          password:''
        };
        this.signIn = this.signIn.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }
    handleEmailChange(e){
        this.setState({email:e.target.value})
    }
    handlePasswordChange(e){
        this.setState({password:e.target.value})
    }
    signIn() {
        axios.post('/signin', {
            email: this.state.email,
            password: this.state.password
          })
          .then(function (response) {
            console.log(response);
            if(response.data !== 'Wrong username password'){
              hashHistory.push('/home/' + response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }
    gotoSignUp(){
      hashHistory.push('signUp');
    }
    guestVisit(){
      hashHistory.push('/home/guest')
    }
    render() {
        return (
        <div>
            <form className="form-signin">
                <h2 className="form-signin-heading"> Please sign in</h2>
                <label for="inputEmail" className="sr-only">Email address</label>
                <input type="email" onChange={this.handleEmailChange} id="inputEmail" className="form-control" placeholder="Email address" required autofocus />
                <label for="inputPassword" className="sr-only">Password</label>
                <input type="password" onChange={this.handlePasswordChange} id="inputPassword" className="form-control" placeholder="Password" required />                
                <button className="btn btn-lg btn-primary btn-block" onClick={this.signIn} type="button">Sign in</button>
            </form>
            <form>
                <button type="button" className="btn btn-success btn-block btn-lg" onClick={this.gotoSignUp.bind(this)}>Sign up</button>
            </form>
            <div>
                <button type="button" className="btn btn-default" onClick={this.guestVisit.bind(this)}>Guest Visit</button>
            </div>
        </div>
        )
    } 
}

class Signup extends React.Component{
    constructor(props) {
      super(props);
      this.signUp = this.signUp.bind(this);
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleEmailChange = this.handleEmailChange.bind(this);
      this.handlePasswordChange = this.handlePasswordChange.bind(this);
      this.state = {
        name:'',
        email:'',
        password:''
      };
    }
    handleNameChange(e){
      this.setState({name:e.target.value})
    }
    handleEmailChange(e){
      this.setState({email:e.target.value})
    }
    handlePasswordChange(e){
      this.setState({password:e.target.value})
    }
    signUp(){
      axios.post('/signup', {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      })
      .then(function (response) {
        console.log(response);
        hashHistory.push('/');
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    gotoSignIn(){
      hashHistory.push('/');
    }
    render() {
        return (
          <div>
            <form className="form-signin">
              <h2 className="form-signin-heading">Please sign up</h2>
              <label for="inputName" className="sr-only">Name</label>
              <input type="name" onChange={this.handleNameChange} id="inputName" className="form-control" placeholder="Name" required autofocus />
              <label for="inputEmail" className="sr-only">Email address</label>
              <input type="email" onChange={this.handleEmailChange} id="inputEmail" className="form-control" placeholder="Email address" required autofocus />
              <label for="inputPassword" className="sr-only">Password</label>
              <input type="password" onChange={this.handlePasswordChange} id="inputPassword" className="form-control" placeholder="Password" required />
              
              <button className="btn btn-lg btn-primary btn-block" onClick={this.signUp} type="button">Sign up</button>
            </form>
            <div>
              <button className="btn btn-success" onClick={this.gotoSignIn.bind(this)}>Back</button>
            </div>
          </div>
          
        )
    }
  }
  
ReactDOM.render(
    <Router history={hashHistory}>
        <Route component={Signin} path="/"></Route>
        <Route component={Signup} path="/signup"></Route>
        <Route component={ShowPost} path="/home(/:name)"></Route>
        <Route component={AddPost} path="/home(/:name)/addPost(/:id)"></Route>
    </Router>,
document.getElementById('app'));