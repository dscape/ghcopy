# ghcopy

dead simple way to copy paste your stdin to github

## setup

install [node]

``` js
$ npm install -g ghcopy
$ ghcopy-authorize
prompt: username: drsocketybearsocks
prompt: password:
{
  "t": "sometoken"
}
```

a file called `~/.ghcopy` containing your token was created. if you are not in windows the permissions have been set so only you can read and write on it. it does not store your username.

if you are not comfortable with this you can create your token manually with curl and specify it each time you invoke ghcopy.

## usage

```
cat ~/.ssh/id_rsa.pub | ghcopy
```

```
Options:
  -d, --description  description for this gist                              [default: "gist created by github.com/dscape/ghcopy"]
  -f, --filename     filename for the file pasted in this gist              [default: "ghcopy.txt"]
  -p, --public       boolean defining if this gist should be public or not  [boolean]  [default: false]
  -o, --open         boolean defining if we should open it in a browser     [boolean]  [default: true]
  -t, --token        define a github token                                  [required]  [default: "from file"]
```

# contribute

everyone is welcome to contribute. patches, bug-fixes, reporters, new features.

1. create an [issue][issues] so the community can comment on your idea
2. fork
3. create a new branch `git checkout -b feature_name`
4. create tests for the changes you made
5. make sure you pass both existing and newly inserted tests
6. commit your changes
7. push to your branch `git push origin feature_name`
8. create an pull request

# meta

* code: `git clone git://github.com/dscape/ghcopy.git`
* home: <http://github.com/dscape/ghcopy>
* bugs: <http://github.com/dscape/ghcopy/issues>

`(oO)--',-` in [caos]

<a name="license"/>
# license

copyright 2012 nuno job <nunojob.com> `(oO)--',--`

licensed under the apache license, version 2.0 (the "license");
you may not use this file except in compliance with the license.
you may obtain a copy of the license at

    http://www.apache.org/licenses/LICENSE-2.0

unless required by applicable law or agreed to in writing, software
distributed under the license is distributed on an "as is" basis,
without warranties or conditions of any kind, either express or implied.
see the license for the specific language governing permissions and
limitations under the license

[node]: http://nodejs.org
[issues]: http://github.com/dscape/ghcopy/issues
[caos]: http://caos.di.uminho.pt/