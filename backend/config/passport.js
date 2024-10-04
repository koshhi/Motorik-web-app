const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const dotenv = require('dotenv')
const cloudinary = require('cloudinary').v2

dotenv.config()

const User = require('../models/User')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  // console.log(profile) //para ver los campos de la cuenta de google
  try {
    let user = await User.findOne({ googleId: profile.id })

    if (!user) {
      let googleImageUrl = profile.photos[0].value
      googleImageUrl = googleImageUrl.replace('=s96-c', '=s400-c')
      const cloudinaryResult = await cloudinary.uploader.upload(googleImageUrl, {
        folder: 'user_avatars',
        use_filename: true
      })
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.name.givenName,
        lastName: profile.name.familyName,
        userAvatar: cloudinaryResult.secure_url,
        emailVerified: true
      })
      await user.save()
    }

    done(null, user)
  } catch (err) {
    done(err, null)
  }
}))

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: 'http://localhost:5002/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ facebookId: profile.id })
    if (!user) {
      user = new User({
        facebookId: profile.id,
        email: profile.emails[0].value,
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        isVerified: true
      })
      await user.save()
    }
    return done(null, user)
  } catch (err) {
    return done(err, null)
  }
}))

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ googleId: id }) // Search by googleId
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})
