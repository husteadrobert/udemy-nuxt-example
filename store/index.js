import Vuex from "vuex";
import axios from "axios";
import Cookie from 'js-cookie'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts;
      },
      addPost(state, post) {
        state.loadedPosts.push(post)
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(post => post.id == editedPost.id );
        state.loadedPosts[postIndex] = editedPost;
      },
      setToken(state, token) {
        state.token = token
      },
      clearToken(state) {
        state.token = null
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        // context.app.$axios.get....
        return axios.get('https://rh-blog-test-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json')
          .then(res => {
            const postsArray = []
            for (const key in res.data) {
              postsArray.push({...res.data[key], id: key})
            }
            vuexContext.commit('setPosts', postsArray)
          })
          .catch(e => context.error(e));
      },
      // async nuxtServerInit({ commit } ,  { error } ) {
      //   try {
      //     const result = await axios.get('https://rh-blog-test-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json');
      //     const postsArray = []
      //     for (const key in result.data) {
      //       postsArray.push( {...result.data[key], id: key});
      //     }
      //     commit('setPosts', postsArray);
      //   } catch (e) {
      //     error(e);
      //   }
      // },
      setPosts(vuexContext, posts) {
        vuexContext.commit("setPosts", posts);
      },
      addPost(store, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        }
        // this.$axios.post...
        return axios.post('https://rh-blog-test-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json?auth=' + store.state.token, createdPost)
        .then(result => {
          store.commit('addPost', {...createdPost, id: result.data.name})
        })
        .catch(e => console.log(e))
      },
      editPost(store, post) {
        return axios.put('https://rh-blog-test-default-rtdb.asia-southeast1.firebasedatabase.app/posts/' + post.id + '.json?auth=' + store.state.token, post)
        .then(res => {
          store.commit('editPost', post);
        })
        .catch(e => console.log(e))
      },
      authenticateUser(store, authData) {
        let authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + process.env.fbAPIKey
        if (!authData.isLogin) {
          authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + process.env.fbAPIKey
        }
        return this.$axios.$post(authUrl, {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        }).then(result => {
          store.commit('setToken', result.idToken)
          localStorage.setItem('token', result.idToken)
          localStorage.setItem('tokenExpiration', new Date().getTime() + +result.expiresIn * 1000)
          Cookie.set('jwt', result.idToken)
          Cookie.set('expirationDate', new Date().getTime() + +result.expiresIn * 1000)
        }).catch(e => console.log(e))
      },
      initAuth(store, req) {
        let token;
        let expirationDate;
        if (req) {
          if (!req.headers.cookie) {
            return;
          }
          const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='))
          if (!jwtCookie) {
            return;
          }
          token = jwtCookie.split('=')[1];
          const expirationDateCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('expirationDate='))
          expirationDate = expirationDateCookie.split('=')[1]
        } else {
          token = localStorage.getItem('token')
          expirationDate = localStorage.getItem('tokenExpiration')
        } 
        if (new Date().getTime() > +expirationDate || !token) {
          store.dispatch('logout')
          return;
        }
        store.commit('setToken', token)
      },
      logout(store) {
        store.commit('clearToken')
        Cookie.remove('jwt')
        Cookie.remove('expirationDate')
        if (process.client) {
          localStorage.removeItem("token")
          localStorage.removeItem("tokenExpiration")
        }
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
      isAuthenticated(state) {
        return !!state.token
      }
    }
  });
};

export default createStore;
