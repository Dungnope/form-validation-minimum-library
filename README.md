#  form-validation-minimum-library

## Intro

This is a small code for form validation, code along tutorial from F8 Offical
Link playlist: [Cách validate form với Javascript (cách 1) - YouTube](https://www.youtube.com/playlist?list=PL_-VfJajZj0UjLMzxqGXUoE6iqpfbZysn) (Vietnamese)
Authour: F8
Website: [F8 web](https://fullstack.edu.vn/)

## How to use it?

The **main.js** contains a object name **Validator**
- The object include:
	+ *form* : contain the id of form
	+ *formGroupSelector* :  the class of a validation field
	+ *errorSelector* : contain the class of error message when faild validation
	+ *onSubmit* : print data to console in developer tool (may use or not)
	+ *rules: The set of validation rules*:
		+ Validator.**isRequired(*input need validating*)** // require to check, 🔒
		+ Validator.**isEmail('#email')** // must be email format,  ✉️
		+ Validator.**minLength("input need validation", length)** // require the minimum length of input 📏
		+ Validator.**isConfirmed("password check id or class", () => {
						return value of password input to check
				})** ✅
    
## Example of form

```
<form  action=""  method="POST"  class="form"  id="form-1">
	<div  class="form-group">
	<label  for="email"  class="form-label">Email</label>
	<input  id="email"  name="email"  type="email"  placeholder="VD: email@domain.com"  class="form-control">
	<span  class="form-message"></span>
</div>

<div  class="form-group">
	<label  for="password"  class="form-label">PassWord</label>
	<input  id="password"  name="password"  type="password"  placeholder="Nhập mật khẩu"  class="form-control">
	<span  class="form-message"></span>
</div>

<div  class="form-group">
	<label  for="password_confirmation"  class="form-label">Nhập lại mật khẩu</label>
	<input  id="password_confirmation"  name="password_confirmation"  placeholder="Nhập lại mật khẩu"  type="password"  class="form-control">
	<span  class="form-message"></span>
</div>

	<button  class="form-submit">Sign up</button>
</form>
```
*The above is sample code for a form*
```
Validator({
	form:  '#form-1',
	formGroupSelector:  '.form-group',
	errorSelector:  '.form-message',
	rules: [
		Validator.isRequired('#email'),
		Validator.isEmail('#email'),
		Validator.minLength('#password',  8),
		Validator.isRequired('#password_confirmation'),
		Validator.isConfirmed('#password_confirmation',  ()  =>  {
			return  document.querySelector("#form-1 #password").value;
		},  'Password not same as above'),

	],
	onSubmit:  (data)  =>  {
		console.log(data);
	}
})

// The validation
```
# ⚠️ If you add a rule that doesn't exist in form, it'll be error!