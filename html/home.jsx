var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var hashHistory = window.ReactRouter.hashHistory;
var Link = window.ReactRouter.Link;

class ShowPost extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        posts:[]
      };
      this.updatePost = this.updatePost.bind(this);
      this.deletePost = this.deletePost.bind(this);
      this.getPost = this.getPost.bind(this);
    }
    componentDidMount(){
      this.getPost();
      document.getElementById('homeHyperlink').className = "active";
      document.getElementById('addHyperLink').className = "";
    }

    getPost(){
      var self = this;
      axios.post('/getPost', {
      })
      .then(function (response) {
        console.log('res is ',response);
        self.setState({posts: response.data})
      })
      .catch(function (error) {
        console.log('error is ',error);
      });
    }

    updatePost(id){
      console.log('update post', id);
      hashHistory.push('/addPost/' + id);
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

    render() {
      return (
        <div>
          <div className="header clearfix">
            <nav>
              <ul className="nav nav-pills pull-right">
                <li role="presentation" id="homeHyperlink" className="active"><a href="#">Home</a></li>
                <li role="presentation" id="addHyperLink"><a href="/home#/addPost">Add</a></li>
                <li role="presentation"><a href="#">Logout</a></li>
              </ul>
            </nav>
              <h3 className="text-muted">React Blog App</h3>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Subject</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.posts.map(function(post,index) {
                   return <tr key={index} >
                            <td>{index+1}</td>
                            <td>{post.title}</td>
                            <td>{post.subject}</td>
                            <td>
                              <span onClick={this.updatePost.bind(this,post._id)} className="glyphicon glyphicon-pencil"></span>
                            </td>
                            <td>
                              <span onClick={this.deletePost.bind(this,post._id)} className="glyphicon glyphicon-remove"></span>
                            </td>
                          </tr>
                }.bind(this))
              }
            </tbody>
          </table>  
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
    };
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.addPost = this.addPost.bind(this);
    this.getPostWithId = this.getPostWithId.bind(this);
  }
  componentDidMount(){
    document.getElementById('addHyperLink').className = "active";
    document.getElementById('homeHyperlink').className = "";
    this.getPostWithId();
  }

  handleTitleChange(e){
    this.setState({title: e.target.value})
  }
  handleSubjectChange(e){
    this.setState({subject: e.target.value})
  }
  addPost(){
    axios.post('/addPost', {
      title: this.state.title,
      subject: this.state.subject,
      id: this.state.id
    })
    .then(function (response) {
      console.log('response from add post is ',response);
      hashHistory.push('/')
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  
  getPostWithId(){
    var id = this.props.params.id;
    var self = this;

    axios.post('/getPostWithId', {
      id: id
    })
    .then(function (response) {
      if(response){
        self.setState({title:response.data.title});
        self.setState({subject:response.data.subject});  
        self.setState({id: id});
      }
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
              <li role="presentation" id="homeHyperlink" className="active"><a href="#">Home</a></li>
              <li role="presentation" id="addHyperLink"><a href="/home#/addPost">Add</a></li>
              <li role="presentation"><a href="#">Logout</a></li>
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

ReactDOM.render(
  <Router history={hashHistory}>
      <Route component={ShowPost} path="/"></Route>
      <Route component={AddPost} path="/addPost(/:id)"></Route>
  </Router>,
document.getElementById('app'));