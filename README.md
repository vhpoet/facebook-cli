Facebook CLI
============

Command line interface for Facebook

## Installation

```
$ npm install facebook-cli
$ fb version
0.0.1
```

## Getting Started

Before starting, you need to [create a facebook app](https://developers.facebook.com/apps), and tell facebook-cli about your credentials (App ID, App Secret).

```
$ fb config
```

## Examples

### fb me
Info about current credentials owner.
```
$ fb me
You are Vahe Hovhannisyan. Your ID is 522128874
Link to your profile: https://facebook.com/vhpoet
```

### fb post {message}
Post message to facebook wall.
```
$ fb post "Hello Facebook"
Status update has been posted.
Here is the link: https://facebook.com/522128874_10151999617388875
```

### fb download:albums {userID} {path}
Download photo albums of a friend.
```
$ fb download 522128874 /users/user/friendphotos
Profile Pictures downloaded successfully.
Mobile Uploads downloaded successfully.
Cover Photos downloaded successfully.

well done!
```

## TODO

Here goes an unlimited section of TODOs..

## Contributions

Whether you want to fix a bug or implement a new feature, the process is pretty much the same:

0. [Search existing issues](https://github.com/vhpoet/facebook-cli/issues); if you can't find anything related to what you want to work on, open a new issue so that you can get some initial feedback.
1. [Fork](https://github.com/vhpoet/facebook-cli/fork) the repository.
2. Make the code changes in your fork.
3. Open a pull request.

## License

Facebook CLI is released under the MIT license. See [LICENSE](https://github.com/vhpoet/facebook-cli/blob/master/LICENSE).
