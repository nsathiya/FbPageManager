// import PostPage from '../PostPage.js';

// class PostsHistory extends React.Component {
//
//   static propTypes = {
//     pageId: PropTypes.string,
//     pageToken: PropTypes.string
//   }.isRequired
//
//   constructor(props) {
//     super(props);
//     this.state = {
//       publishedPosts: [],
//       unpublishedPosts: [],
//       scheduledPosts: [],
//       removeModal: false,
//       removeModalRef: "",
//     };
//
//     this.fetchPublishedPosts = this.fetchPublishedPosts.bind(this);
//     this.fetchUnpublishedPosts = this.fetchUnpublishedPosts.bind(this);
//     this.publishPost = this.publishPost.bind(this);
//     this.getPostViews = this.getPostViews.bind(this);
//     this.returnDateTimeString = this.returnDateTimeString.bind(this);
//     this.handleChange = this.handleChange.bind(this);
//     this.closeModals = this.closeModals.bind(this);
//     this.openModals = this.openModals.bind(this);
//     this.removePost = this.removePost.bind(this);
//   }
//
//   componentDidMount() {
//     this.fetchUnpublishedPosts();
//     this.fetchPublishedPosts();
//   }
//
//   handleChange(e) {
//     const name = e.target.name;
//     const value = e.target.value;
//     this.setState({
//       [name]: value,
//     });
//   }
//
//   removePost(e){
//     FB.api(
//       `/${this.state.removeModalRef}`,
//       'DELETE',
//       {
//         access_token: `${this.props.pageToken}`,
//       },
//       (response) => {
//         console.log(response);
//         if (response.success){
//           this.closeModals();
//           this.fetchPublishedPosts();
//         }
//       },
//     );
//   }
//
//   openModals(action, id, message){
//
//     if (action == 'delete')
//       this.setState({
//         removeModal : true,
//         removeModalRef: id,
//       })
//   }
//
//   closeModals() {
//     this.setState({
//       removeModal: false,
//       removeModalRef: ""
//     })
//   }
//
//   //fetch each unpublished posts with particular fields
//   fetchUnpublishedPosts() {
//     FB.api(
//       `/${this.props.pageId}/promotable_posts?fields=scheduled_publish_time,message,created_time`,
//       'GET',
//       {
//         access_token: `${this.props.pageToken}`,
//         is_published: false,
//       },
//       (response) => {
//         console.log(response);
//         if (response.data){
//           this.setState({
//             unpublishedPosts: response.data,
//           });
//         }
//       },
//     );
//   }
//
//   //For each published posts, get its number of impressions
//   fetchPublishedPosts() {
//     FB.api(
//       `/${this.props.pageId}/posts`,
//       'GET',
//       {
//         access_token: `${this.props.pageToken}`,
//       },
//       (response) => {
//         console.log('Fetched published posts...', response);
//
//         if (response.data){
//           response.data.forEach((d, i) => {
//             FB.api(
//               `/${d.id}/insights/post_impressions_unique`,
//               'GET',
//               {
//                 access_token: `${this.props.pageToken}`,
//               },
//               (res) => {
//                 console.log(res);
//                 response.data[i].views = res.data[0].values[0].value;
//
//                 this.setState({
//                   publishedPosts: response.data,
//                 });
//               },
//             );
//           });
//         }
//         this.setState({
//           publishedPosts: response.data,
//         });
//       },
//     );
//   }
//
//   //Publish unpublished post
//   publishPost(id) {
//     FB.api(
//       `/${id}/`,
//       'POST',
//       {
//         access_token: `${this.props.pageToken}`,
//         is_published: true,
//       },
//       (response) => {
//         this.fetchPublishedPosts();
//         this.fetchUnpublishedPosts();
//       },
//     );
//   }
//
//   //Get unique post impressions
//   getPostViews(id) {
//     FB.api(
//       `/${id}/insights/post_impressions_unique`,
//       'GET',
//       {
//         access_token: `${this.props.pageToken}`,
//       },
//       (response) => {
//         console.log(response);
//       },
//     );
//   }
//
//   //Return formatted date/time
//   returnDateTimeString(time){
//     let d = new Date(time);
//     let hours = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
//     let minutes = "0" + d.getMinutes();
//     let seconds = "0" + d.getSeconds();
//
//     let formattedTime = d.toDateString() + " "
//                         + hours + ":"
//                         + minutes.substr(-2) + ":"
//                         + seconds.substr(-2)
//
//     return formattedTime;
//   }
//   render() {
//
//     return (
//       <div>
//         <h4>Published: </h4>
//         {
//           this.state.publishedPosts.map(pp => (
//
//             <section className="panel panel-info">
//               <header className="panel-heading">
//                 <h5 className="panel-title">{ this.returnDateTimeString(pp.created_time) }</h5>
//               </header>
//               <div className="panel-body">
//                 <p>{pp.message}</p>
//                 <div><b>Views:</b> {pp.views}</div>
//               </div>
//               <div className="panel-footer">
//                 <div>
//                   <button className="btn btn-danger btn-sm" onClick={this.openModals.bind(this, 'delete', pp.id)}>Delete Post</button>
//                 </div>
//               </div>
//             </section>
//           ))
//         }
//         <h4>Not published yet: </h4>
//         {
//           this.state.unpublishedPosts.map(pp => (
//             <section className="panel panel-warning">
//               <header className="panel-heading">
//                 <h5 className="panel-title">{ this.returnDateTimeString(pp.created_time) }</h5>
//               </header>
//               <div className="panel-body">
//                 <p>{pp.message}</p>
//                 {pp.scheduled_publish_time ? <div><b>Scheduled:</b> { this.returnDateTimeString(pp.scheduled_publish_time*1000) }</div> : null}
//               </div>
//               <div className="panel-footer">
//                 <button className="btn btn-warning btn-sm" onClick={this.publishPost.bind(this, pp.id)}>Publish Post</button>
//               </div>
//             </section>
//           ))
//         }
//
//         <Modal show={this.state.removeModal} onHide={this.closeModals}>
//           <Modal.Header closeButton>
//             <Modal.Title>Remove Post</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <b>Please confirm. This action cannot be undone.</b>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button onClick={this.removePost}>Delete</Button>
//             <Button onClick={this.closeModals}>Close</Button>
//           </Modal.Footer>
//         </Modal>
//       </div>
//     );
//   }
//
// }
//
// class PostToPage extends React.Component {
//
//   static propTypes = {
//     pageId: PropTypes.string,
//     pageToken: PropTypes.string
//   }.isRequired
//
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       message: '',
//       postType: '1',
//       minutesDelayed: 0,
//       scheduleModal: false,
//       confirmModal: false
//     };
//
//     this.postToPage = this.postToPage.bind(this);
//     this.handleChange = this.handleChange.bind(this);
//     this.closeModals = this.closeModals.bind(this);
//     this.openModals = this.openModals.bind(this);
//   }
//
//   componentDidMount() {
//
//   }
//
//   closeModals(e) {
//     this.setState({
//       scheduleModal: false,
//       confirmModal: false
//     })
//   }
//
//   openModals(e, type) {
//     e.preventDefault();
//
//     if (type == 'confirm')
//       this.setState({
//         confirmModal: true
//       })
//     if (type == 'schedule')
//       this.setState({
//         scheduleModal: true
//       })
//   }
//
//   handleChange(e) {
//     const name = e.target.name;
//     const value = e.target.value;
//     this.setState({
//       [name]: value,
//     });
//
//     if (name == 'postType' && value == 2)
//       this.setState({
//         scheduleModal: true
//       })
//   }
//
//   postToPage(e) {
//     e.preventDefault();
//     let postReq = {};
//     postReq.published = false;
//     postReq.message = `${this.state.message}`;
//     postReq.access_token = `${this.props.pageToken}`;
//     if (this.state.postType == '2') { postReq.scheduled_publish_time = Math.round(new Date().getTime() / 1000) + (this.state.minutesDelayed * 60)}
//     if (this.state.postType == '3') { postReq.published = true; }
//
//     console.log(postReq);
//
//     FB.api(
//       `/${this.props.pageId}/feed/`,
//       'POST',
//       postReq,
//       (response) => {
//         if (response.id) {
//           this.setState({
//             message: '',
//           });
//           this.closeModals();
//         }
//       },
//     );
//   }
//
//   render() {
//     let postType = "";
//     if (this.state.postType == '1')
//       postType = 'unpublished';
//     if (this.state.postType == '2')
//       postType = 'scheduled';
//     if (this.state.postType == '3')
//       postType = 'published';
//
//
//     return (
//       <form onSubmit={e => this.openModals(e, 'confirm')} className="facebook-share-box">
//
//         <div>
//
//           <div className="share">
//             <div className="arrow" />
//             <div className="panel panel-default">
//               <div className="panel-heading"><i className="fa fa-file" /> Update Status</div>
//               <div className="panel-body">
//                 <div className="">
//                   <textarea name="message" value={this.state.message} cols="40" rows="10" id="status_message" className="form-control message" style={{ height: '62px', overflow: 'hidden' }} placeholder="What's on your mind ?" onChange={this.handleChange} />
//                 </div>
//               </div>
//               <div className="panel-footer">
//
//                 <div className="row">
//                   <div className="col-md-7">
//                     <div className="form-group">
//                     </div>
//                   </div>
//                   <div className="col-md-3 pull-right">
//                     <div className="form-group">
//                       <select name="postType" className="form-control privacy-dropdown pull-left input-sm" onChange={this.handleChange}>
//                         <option value="1" selected="selected">Unpublished</option>
//                         <option value="2">Scheduled</option>
//                         <option value="3">Published</option>
//                       </select>
//                       <input type="submit" name="submit" value="Post" className="btn btn-primary pull-right" />
//                     </div>
//                   </div>
//                 </div>
//
//               </div>
//             </div>
//           </div>
//
//           <div>
//             <Modal show={this.state.scheduleModal} onHide={this.closeModals}>
//               <Modal.Header closeButton>
//                 <Modal.Title>Schedule Post</Modal.Title>
//               </Modal.Header>
//               <Modal.Body>
//                 <h4>Choose number of mins publishing of page should be delayed by</h4>
//                 <form>
//                   <select name="minutesDelayed" className="form-control privacy-dropdown pull-left input-sm" onChange={this.handleChange}>
//                     <option value="10" selected="selected">10</option>
//                     <option value="11">11</option>
//                     <option value="12">12</option>
//                     <option value="13">13</option>
//                     <option value="14">14</option>
//                     <option value="15">15</option>
//                     <option value="16">16</option>
//                     <option value="17">17</option>
//                     <option value="18">18</option>
//                     <option value="19">19</option>
//                     <option value="20">20</option>
//                   </select>
//                 </form>
//               </Modal.Body>
//               <Modal.Footer>
//                 <Button onClick={this.closeModals}>Submit</Button>
//                 <Button onClick={this.closeModals}>Close</Button>
//               </Modal.Footer>
//             </Modal>
//
//             <Modal show={this.state.confirmModal} onHide={this.closeModals}>
//               <Modal.Header closeButton>
//                 <Modal.Title>Schedule Post</Modal.Title>
//               </Modal.Header>
//               <Modal.Body>
//                 <h4>Please confirm to create {postType} post</h4>
//               </Modal.Body>
//               <Modal.Footer>
//                 <Button onClick={this.postToPage.bind(this)}>Submit</Button>
//                 <Button onClick={this.closeModals}>Close</Button>
//               </Modal.Footer>
//             </Modal>
//           </div>
//         </div>
//
//       </form>
//     );
//   }
//
// }

// export default withStyles(s)(PostToPage);
